'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, Perfil, Notificacion } from '@/lib/supabase';
import { useUsuarioActual } from '@/lib/useUsuarioActual';
import { useTheme, type Tema } from '@/lib/useTheme';
import {
  listarNotificaciones,
  marcarNotificacionesLeidas,
  listarInscripciones,
  inscribirse,
  desinscribirse,
  listarTutoriaInscripciones,
  agendarTutoria,
  cancelarTutoria,
  marcarContactoTutor,
  listarObjetivosEstado,
  alternarObjetivo as alternarObjetivoDb,
  sumarPuntos,
  hacerCheckin,
} from '@/lib/social';
import type { ItemTipo } from '@/lib/catalogo';

type SheetRef = { tipo: ItemTipo; id: string } | null;
type StoryFlowStep = 'capture' | 'preview' | 'tag' | null;

type AppShellValue = {
  usuario: Perfil;
  refrescarUsuario: () => Promise<void>;
  cerrarSesion: () => void;
  tema: Tema;
  setTema: (t: Tema) => void;

  confettiOn: boolean;
  dispararConfetti: () => void;

  sheet: SheetRef;
  abrirFicha: (tipo: ItemTipo, id: string) => void;
  cerrarFicha: () => void;

  notifOpen: boolean;
  notificaciones: Notificacion[];
  hayNoLeidas: boolean;
  abrirNotif: () => void;
  cerrarNotif: () => void;

  wrappedOpen: boolean;
  abrirWrapped: () => void;
  cerrarWrapped: () => void;

  inscripciones: Set<string>;
  alternarInscripcion: (itemId: string, itemTipo: 'evento' | 'vida' | 'oportunidad' | 'beneficio', puntos: number) => Promise<void>;

  tutoriaEstados: Record<string, 'agendada' | 'contactado'>;
  alternarAgendar: (tutoriaId: string) => Promise<void>;
  marcarContacto: (tutoriaId: string) => Promise<void>;

  objetivosEstado: Record<string, boolean>;
  alternarObjetivo: (objetivoId: string, puntosDelta: number) => Promise<void>;

  doCheckin: () => Promise<void>;

  storyFlow: StoryFlowStep;
  fotoCapturadaUrl: string | null;
  archivoCapturado: File | null;
  actividadEtiquetada: string | null;
  abrirCaptura: () => void;
  cerrarFlujoHistoria: () => void;
  irAPreview: (archivo: File) => void;
  irATagStep: () => void;
  etiquetarActividad: (actividadId: string) => void;
  haPublicadoHistoria: boolean;
  marcarHistoriaPublicada: () => void;
};

const AppShellContext = createContext<AppShellValue | null>(null);

export function useAppShell() {
  const ctx = useContext(AppShellContext);
  if (!ctx) throw new Error('useAppShell debe usarse dentro de <AppShellProvider>');
  return ctx;
}

export function AppShellProvider({ children }: { children: ReactNode }) {
  const { usuario: usuarioBase, cargando, cerrarSesion } = useUsuarioActual();
  const { tema, setTema } = useTheme();
  const router = useRouter();

  const [usuario, setUsuario] = useState<Perfil | null>(null);
  const [confettiOn, setConfettiOn] = useState(false);
  const [sheet, setSheet] = useState<SheetRef>(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [wrappedOpen, setWrappedOpen] = useState(false);
  const [inscripciones, setInscripciones] = useState<Set<string>>(new Set());
  const [tutoriaEstados, setTutoriaEstados] = useState<Record<string, 'agendada' | 'contactado'>>({});
  const [objetivosEstado, setObjetivosEstado] = useState<Record<string, boolean>>({});
  const [storyFlow, setStoryFlow] = useState<StoryFlowStep>(null);
  const [archivoCapturado, setArchivoCapturado] = useState<File | null>(null);
  const [fotoCapturadaUrl, setFotoCapturadaUrl] = useState<string | null>(null);
  const [actividadEtiquetada, setActividadEtiquetada] = useState<string | null>(null);
  const [haPublicadoHistoria, setHaPublicadoHistoria] = useState(false);

  const refrescarUsuario = useCallback(async () => {
    if (!usuarioBase) return;
    const { data } = await supabase.from('perfiles').select('*').eq('id', usuarioBase.id).single();
    if (data) {
      setUsuario(data);
      localStorage.setItem('campus360_usuario', JSON.stringify(data));
    }
  }, [usuarioBase]);

  useEffect(() => {
    if (cargando || !usuarioBase) return;
    refrescarUsuario();
    (async () => {
      const [notifs, insc, tuts, objs, historiasMias] = await Promise.all([
        listarNotificaciones(usuarioBase.id),
        listarInscripciones(usuarioBase.id),
        listarTutoriaInscripciones(usuarioBase.id),
        listarObjetivosEstado(usuarioBase.id),
        supabase.from('historias').select('id').eq('usuario_id', usuarioBase.id).limit(1),
      ]);
      setNotificaciones(notifs);
      setInscripciones(new Set(insc));
      setTutoriaEstados(tuts);
      setObjetivosEstado(objs);
      setHaPublicadoHistoria((historiasMias.data?.length || 0) > 0);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cargando, usuarioBase?.id]);

  const dispararConfetti = useCallback(() => {
    setConfettiOn(false);
    setTimeout(() => {
      setConfettiOn(true);
      setTimeout(() => setConfettiOn(false), 1600);
    }, 20);
  }, []);

  const abrirFicha = useCallback((tipo: ItemTipo, id: string) => setSheet({ tipo, id }), []);
  const cerrarFicha = useCallback(() => setSheet(null), []);

  const abrirNotif = useCallback(async () => {
    setNotifOpen(true);
    if (!usuarioBase) return;
    await marcarNotificacionesLeidas(usuarioBase.id);
    setNotificaciones((prev) => prev.map((n) => ({ ...n, leida: true })));
  }, [usuarioBase]);
  const cerrarNotif = useCallback(() => setNotifOpen(false), []);

  const abrirWrapped = useCallback(() => setWrappedOpen(true), []);
  const cerrarWrapped = useCallback(() => setWrappedOpen(false), []);

  const alternarInscripcion = useCallback(
    async (itemId: string, itemTipo: 'evento' | 'vida' | 'oportunidad' | 'beneficio', puntos: number) => {
      if (!usuario) return;
      const yaInscrito = inscripciones.has(itemId);
      if (yaInscrito) {
        await desinscribirse(usuario.id, itemId);
        const nuevos = await sumarPuntos(usuario.id, -puntos, usuario.puntos);
        setUsuario({ ...usuario, puntos: nuevos });
        setInscripciones((prev) => {
          const next = new Set(prev);
          next.delete(itemId);
          return next;
        });
      } else {
        await inscribirse(usuario.id, itemId, itemTipo);
        const nuevos = await sumarPuntos(usuario.id, puntos, usuario.puntos);
        setUsuario({ ...usuario, puntos: nuevos });
        setInscripciones((prev) => new Set(prev).add(itemId));
        dispararConfetti();
      }
    },
    [usuario, inscripciones, dispararConfetti]
  );

  const alternarAgendar = useCallback(
    async (tutoriaId: string) => {
      if (!usuario) return;
      const yaAgendada = !!tutoriaEstados[tutoriaId];
      if (yaAgendada) {
        await cancelarTutoria(usuario.id, tutoriaId);
        const nuevos = await sumarPuntos(usuario.id, -20, usuario.puntos);
        setUsuario({ ...usuario, puntos: nuevos });
        setTutoriaEstados((prev) => {
          const next = { ...prev };
          delete next[tutoriaId];
          return next;
        });
      } else {
        await agendarTutoria(usuario.id, tutoriaId);
        const nuevos = await sumarPuntos(usuario.id, 20, usuario.puntos);
        setUsuario({ ...usuario, puntos: nuevos });
        setTutoriaEstados((prev) => ({ ...prev, [tutoriaId]: 'agendada' }));
        dispararConfetti();
      }
    },
    [usuario, tutoriaEstados, dispararConfetti]
  );

  const marcarContacto = useCallback(
    async (tutoriaId: string) => {
      if (!usuario) return;
      await marcarContactoTutor(usuario.id, tutoriaId);
      setTutoriaEstados((prev) => ({ ...prev, [tutoriaId]: 'contactado' }));
      dispararConfetti();
    },
    [usuario, dispararConfetti]
  );

  const alternarObjetivo = useCallback(
    async (objetivoId: string, puntosDelta: number) => {
      if (!usuario) return;
      const actual = objetivosEstado[objetivoId] || false;
      const nuevoEstado = await alternarObjetivoDb(usuario.id, objetivoId, actual);
      setObjetivosEstado((prev) => ({ ...prev, [objetivoId]: nuevoEstado }));
      const nuevos = await sumarPuntos(usuario.id, nuevoEstado ? puntosDelta : -puntosDelta, usuario.puntos);
      setUsuario({ ...usuario, puntos: nuevos });
      if (nuevoEstado) dispararConfetti();
    },
    [usuario, objetivosEstado, dispararConfetti]
  );

  const doCheckin = useCallback(async () => {
    if (!usuario) return;
    const actualizado = await hacerCheckin(usuario);
    if (actualizado) {
      setUsuario(actualizado);
      dispararConfetti();
    }
  }, [usuario, dispararConfetti]);

  const abrirCaptura = useCallback(() => setStoryFlow('capture'), []);
  const cerrarFlujoHistoria = useCallback(() => {
    setStoryFlow(null);
    setArchivoCapturado(null);
    if (fotoCapturadaUrl) URL.revokeObjectURL(fotoCapturadaUrl);
    setFotoCapturadaUrl(null);
    setActividadEtiquetada(null);
  }, [fotoCapturadaUrl]);
  const irAPreview = useCallback((archivo: File) => {
    setArchivoCapturado(archivo);
    setFotoCapturadaUrl(URL.createObjectURL(archivo));
    setStoryFlow('preview');
  }, []);
  const irATagStep = useCallback(() => setStoryFlow('tag'), []);
  const etiquetarActividad = useCallback((actividadId: string) => setActividadEtiquetada(actividadId), []);
  const marcarHistoriaPublicada = useCallback(() => setHaPublicadoHistoria(true), []);

  const value = useMemo<AppShellValue | null>(() => {
    if (!usuario) return null;
    return {
      usuario,
      refrescarUsuario,
      cerrarSesion: () => {
        cerrarSesion();
        router.push('/login');
      },
      tema,
      setTema,
      confettiOn,
      dispararConfetti,
      sheet,
      abrirFicha,
      cerrarFicha,
      notifOpen,
      notificaciones,
      hayNoLeidas: notificaciones.some((n) => !n.leida),
      abrirNotif,
      cerrarNotif,
      wrappedOpen,
      abrirWrapped,
      cerrarWrapped,
      inscripciones,
      alternarInscripcion,
      tutoriaEstados,
      alternarAgendar,
      marcarContacto,
      objetivosEstado,
      alternarObjetivo,
      doCheckin,
      storyFlow,
      fotoCapturadaUrl,
      archivoCapturado,
      actividadEtiquetada,
      abrirCaptura,
      cerrarFlujoHistoria,
      irAPreview,
      irATagStep,
      etiquetarActividad,
      haPublicadoHistoria,
      marcarHistoriaPublicada,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    usuario,
    tema,
    confettiOn,
    sheet,
    notifOpen,
    notificaciones,
    wrappedOpen,
    inscripciones,
    tutoriaEstados,
    objetivosEstado,
    storyFlow,
    fotoCapturadaUrl,
    archivoCapturado,
    actividadEtiquetada,
    haPublicadoHistoria,
  ]);

  if (cargando || !usuarioBase || !value) return null;

  return <AppShellContext.Provider value={value}>{children}</AppShellContext.Provider>;
}
