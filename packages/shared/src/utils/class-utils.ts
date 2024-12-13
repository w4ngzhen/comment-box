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

/**
 * classnames简单实现
 * https://www.npmjs.com/package/classnames
 * @param classNames
 */
export const cls = (...classNames: string[]) => {
  return (classNames || []).filter((cn) => !!cn).join(' ');
};
