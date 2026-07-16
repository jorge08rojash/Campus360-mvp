// Mapea el correo institucional de cada perfil demo a su foto (cuando exista).
// Subí las fotos a /public/fotos/perfiles/ con estos nombres exactos y aparecerán solas.
export const fotoPorCorreo: Record<string, string> = {
  'emilio.mora@ufidelitas.ac.cr': '/fotos/perfiles/perfil-emilio.jpg',
  'andres.hidalgo@ufidelitas.ac.cr': '/fotos/perfiles/perfil-andres.jpg',
  'sofia.loaiza@ufidelitas.ac.cr': '/fotos/perfiles/perfil-sofia.jpg',
  'suri.gonzalez@ufidelitas.ac.cr': '/fotos/perfiles/perfil-suri.jpg',
};

export function fotoDePerfil(correo: string | undefined | null): string | undefined {
  if (!correo) return undefined;
  return fotoPorCorreo[correo.toLowerCase()];
}
