export const permisos = {
  admin: [1, 2],
  user: [1],
  jefe: [1, 2, 3],
};

let pages = [["Sign In", "signIn"]];

export const paginasPermitidas = (rol: string | null) => {
  if (rol === "admin") {
    pages = [
      ["Resumen", "/"],
      ["Crear Peticion", "crear-peticion"],
      ["subordinados", "lider/subordinados"],
      ["Crear Flujos", "admin/crear-flujos"],
    ];
  }

  if (rol === "user") {
    pages = [
      ["Resumen", "/"],
      ["Crear Peticion", "crear-peticion"],
      ["Counter", "counter"],
    ];
  }

  if (rol === "jefe") {
    pages = [
      ["Resumen", "/"],
      ["Crear Peticion", "crear-peticion"],
      ["subordinados", "lider/subordinados"],
      ["Counter", "counter"],
    ];
  }

  return pages;
};
