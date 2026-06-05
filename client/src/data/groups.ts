export type Team = {
  name: string
  flag: string
  host?: boolean
  debut?: boolean
}

export type Group = {
  id: string
  teams: Team[]
}

export const GROUPS: Group[] = [
  { id: "A", teams: [
    { name: "Mexico", flag: "🇲🇽", host: true },
    { name: "South Africa", flag: "🇿🇦" },
    { name: "South Korea", flag: "🇰🇷" },
    { name: "Czechia", flag: "🇨🇿" },
  ]},
  { id: "B", teams: [
    { name: "Canada", flag: "🇨🇦", host: true },
    { name: "Bosnia-Herz.", flag: "🇧🇦" },
    { name: "Qatar", flag: "🇶🇦" },
    { name: "Switzerland", flag: "🇨🇭" },
  ]},
  { id: "C", teams: [
    { name: "Brazil", flag: "🇧🇷" },
    { name: "Morocco", flag: "🇲🇦" },
    { name: "Haiti", flag: "🇭🇹" },
    { name: "Scotland", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿" },
  ]},
  { id: "D", teams: [
    { name: "USA", flag: "🇺🇸", host: true },
    { name: "Paraguay", flag: "🇵🇾" },
    { name: "Australia", flag: "🇦🇺" },
    { name: "Türkiye", flag: "🇹🇷" },
  ]},
  { id: "E", teams: [
    { name: "Germany", flag: "🇩🇪" },
    { name: "Ecuador", flag: "🇪🇨" },
    { name: "Ivory Coast", flag: "🇨🇮" },
    { name: "Curaçao", flag: "🇨🇼", debut: true },
  ]},
  { id: "F", teams: [
    { name: "Netherlands", flag: "🇳🇱" },
    { name: "Japan", flag: "🇯🇵" },
    { name: "Sweden", flag: "🇸🇪" },
    { name: "Tunisia", flag: "🇹🇳" },
  ]},
  { id: "G", teams: [
    { name: "Belgium", flag: "🇧🇪" },
    { name: "Egypt", flag: "🇪🇬" },
    { name: "Iran", flag: "🇮🇷" },
    { name: "New Zealand", flag: "🇳🇿" },
  ]},
  { id: "H", teams: [
    { name: "Spain", flag: "🇪🇸" },
    { name: "Uruguay", flag: "🇺🇾" },
    { name: "Saudi Arabia", flag: "🇸🇦" },
    { name: "Cape Verde", flag: "🇨🇻", debut: true },
  ]},
  { id: "I", teams: [
    { name: "France", flag: "🇫🇷" },
    { name: "Senegal", flag: "🇸🇳" },
    { name: "Norway", flag: "🇳🇴" },
    { name: "Iraq", flag: "🇮🇶" },
  ]},
  { id: "J", teams: [
    { name: "Argentina", flag: "🇦🇷" },
    { name: "Algeria", flag: "🇩🇿" },
    { name: "Austria", flag: "🇦🇹" },
    { name: "Jordan", flag: "🇯🇴", debut: true },
  ]},
  { id: "K", teams: [
    { name: "Portugal", flag: "🇵🇹" },
    { name: "Colombia", flag: "🇨🇴" },
    { name: "Uzbekistan", flag: "🇺🇿", debut: true },
    { name: "DR Congo", flag: "🇨🇩" },
  ]},
  { id: "L", teams: [
    { name: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
    { name: "Croatia", flag: "🇭🇷" },
    { name: "Ghana", flag: "🇬🇭" },
    { name: "Panama", flag: "🇵🇦" },
  ]},
]

// QUALIFICATION RULES:
// ✅ Top 2 from each group = 24 teams advance automatically
// ✅ Best 8 third-place teams = 8 more teams advance
// ✅ Total 32 teams enter the Round of 32