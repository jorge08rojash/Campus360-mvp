// Guardado local (localStorage) para los módulos SIMULADOS.
// Permite que acciones como "agendar tutoría" o "registrarme a un evento"
// se sientan reales y persistan entre visitas, sin necesitar base de datos.
// Cada usuario tiene su propio espacio de datos (por su id).

function claveUsuario(usuarioId: string, coleccion: string) {
  return `campus360_sim_${usuarioId}_${coleccion}`;
}

export function leerColeccion<T>(usuarioId: string, coleccion: string): T[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(claveUsuario(usuarioId, coleccion));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function guardarColeccion<T>(usuarioId: string, coleccion: string, valor: T[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(claveUsuario(usuarioId, coleccion), JSON.stringify(valor));
}

export function agregarItem<T>(usuarioId: string, coleccion: string, item: T): T[] {
  const actual = leerColeccion<T>(usuarioId, coleccion);
  const nuevo = [...actual, item];
  guardarColeccion(usuarioId, coleccion, nuevo);
  return nuevo;
}

export function quitarItem<T extends { id: string }>(usuarioId: string, coleccion: string, id: string): T[] {
  const actual = leerColeccion<T>(usuarioId, coleccion);
  const nuevo = actual.filter((i) => i.id !== id);
  guardarColeccion(usuarioId, coleccion, nuevo);
  return nuevo;
}
