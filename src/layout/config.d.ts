export interface menuItem {
  title: String,
  url: String,
  icon?: String,
  children?: Array<menuItem>
}