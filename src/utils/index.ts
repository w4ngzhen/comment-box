export const cls = (...classNames: string[]) => {
  return (classNames || []).filter((cn) => !!cn).join(' ');
};
