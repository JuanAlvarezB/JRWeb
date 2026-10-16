/**
 * Une nombres de clase CSS ignorando los valores vacíos.
 *
 * @example cx(styles.button, isActive && styles.active) // "button active"
 */
export function cx(...classNames: readonly (string | false | null | undefined)[]): string {
  return classNames
    .filter((name): name is string => typeof name === 'string' && name !== '')
    .join(' ');
}
