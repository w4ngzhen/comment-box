export const getClassname = (className: string) => {
  return `comment-box_${className}`;
};

export const baseClassSupplier = (moduleClass: string) => {
  return (clsName?: string) => {
    return !clsName
      ? getClassname(moduleClass)
      : getClassname(`${moduleClass}-` + clsName);
  };
};
