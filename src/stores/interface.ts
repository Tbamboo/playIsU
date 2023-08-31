export interface configProviderInterface {
  locale: string,
  size: string,
  zIndex: number,
  namespace: string,
  button: {autoInsertSpace?: boolean},
  message: {max?: number}
}