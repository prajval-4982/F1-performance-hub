/* lib/constants.ts — team colours, drivers, 2026 context */

export interface TeamInfo {
    id: string;
    name: string;
    color: string;
    driver: string;
    logo: string;
}

export const TEAMS_LIST: TeamInfo[] = [
    { id: 'mercedes', name: 'Mercedes', color: '#27F4D2', driver: 'Russell', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fb/Mercedes_AMG_Petronas_F1_Logo.svg' },
    { id: 'ferrari', name: 'Ferrari', color: '#E8002D', driver: 'Leclerc', logo: 'https://upload.wikimedia.org/wikipedia/en/3/36/Scuderia_Ferrari_logo.svg' },
    { id: 'mclaren', name: 'McLaren', color: '#FF8000', driver: 'Norris', logo: 'https://upload.wikimedia.org/wikipedia/en/6/66/McLaren_Racing_logo.svg' },
    { id: 'redbull', name: 'Red Bull', color: '#3671C6', driver: 'Verstappen', logo: 'https://upload.wikimedia.org/wikipedia/en/b/b5/Red_Bull_Racing_logo.svg' },
];

export const CONSTRUCTOR_COLOR_MAP: Record<string, string> = {
    mercedes: '#27F4D2',
    ferrari: '#E8002D',
    mclaren: '#FF8000',
    red_bull: '#3671C6',
    williams: '#00A3E0',
    alpine: '#0090FF',
    aston_martin: '#006F62',
    rb: '#6692FF',
    haas: '#B6BABD',
    kick_sauber: '#9B0000',
};

export interface Team2026 {
    name: string;
    color: string;
    status: string;
    logo: string;
    note: string;
}

export const TEAMS_2026: Team2026[] = [
    { name: 'Mercedes', color: '#27F4D2', status: '✅', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fb/Mercedes_AMG_Petronas_F1_Logo.svg', note: 'Dominant — nailed the new 50/50 ICE-electric regs' },
    { name: 'Ferrari', color: '#E8002D', status: '🟡', logo: 'https://upload.wikimedia.org/wikipedia/en/3/36/Scuderia_Ferrari_logo.svg', note: 'Fast starters, strong ICE output, not matching Merc pace yet' },
    { name: 'Haas', color: '#B6BABD', status: '✅', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Haas_F1_Team_logo.svg', note: 'Bearman leading midfield — best start in years' },
    { name: 'McLaren', color: '#FF8000', status: '❌', logo: 'https://upload.wikimedia.org/wikipedia/en/6/66/McLaren_Racing_logo.svg', note: 'Best chassis but 4 DNS in 2 weekends — PU reliability crisis' },
    { name: 'Red Bull', color: '#3671C6', status: '❌', logo: 'https://upload.wikimedia.org/wikipedia/en/b/b5/Red_Bull_Racing_logo.svg', note: 'Verstappen most vocal — hardest regs era for the team' },
    { name: 'Alpine', color: '#0090FF', status: '🟡', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Alpine_F1_Team_Logo.svg', note: 'Gasly scoring points every race — consistent points threat' },
    { name: 'Racing Bulls', color: '#6692FF', status: '🟡', logo: 'https://upload.wikimedia.org/wikipedia/en/0/02/Visa_Cash_App_RB_F1_Team_logo.svg', note: 'Lindblad debut points — promising rookie form' },
    { name: 'Audi', color: '#9B0000', status: '✅', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Audi_logo_detail.svg', note: 'First ever F1 championship points on debut weekend' },
    { name: 'Aston Martin', color: '#006F62', status: '🟡', logo: 'https://upload.wikimedia.org/wikipedia/en/2/2b/Aston_Martin_F1_Team_logo.svg', note: 'Honda factory transition — aero looks promising' },
    { name: 'Williams', color: '#00A3E0', status: '🟡', logo: 'https://upload.wikimedia.org/wikipedia/en/7/70/Williams_F1_logo.svg', note: 'Steady progress, focusing on low-drag efficiency' },
    { name: 'Andretti Cadillac', color: '#FFFFFF', status: '✅', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Andretti_Autosport_logo.svg/2560px-Andretti_Autosport_logo.svg.png', note: 'The 11th team — solid debut, showing real midfield pace' },
];

export interface RegNote {
    cls: string;
    text: string;
}

export const REG_NOTES_2026: RegNote[] = [
    { cls: 'b-teal', text: '50/50 ICE-Electric split — new PU formula, biggest shake-up since 2014' },
    { cls: 'b-teal', text: 'Mercedes nailed the regs — 4 race/sprint wins across first 2 weekends' },
    { cls: 'b-orange', text: 'McLaren have best chassis but PU failures have cost them both races' },
    { cls: 'b-blue', text: 'Red Bull RB21 overweight and underperforming on the new architecture' },
    { cls: 'b-red', text: 'Ferrari strong on race starts — turbo design gives launch advantage' },
    { cls: 'b-gray', text: 'Audi and Haas both outperforming expectations early in the season' },
];

export function teamColor(constructorId: string): string {
    return CONSTRUCTOR_COLOR_MAP[constructorId] || '#888';
}

export const FLAG_MAP: Record<string, string> = {
    'Australia': '🇦🇺', 'China': '🇨🇳', 'Japan': '🇯🇵', 'Bahrain': '🇧🇭',
    'Saudi Arabia': '🇸🇦', 'Miami': '🇺🇸', 'Canada': '🇨🇦', 'Spain': '🇪🇸',
    'Monaco': '🇲🇨', 'Great Britain': '🇬🇧', 'Hungary': '🇭🇺', 'Belgium': '🇧🇪',
    'Netherlands': '🇳🇱', 'Italy': '🇮🇹', 'Azerbaijan': '🇦🇿', 'Singapore': '🇸🇬',
    'United States': '🇺🇸', 'Mexico': '🇲🇽', 'Brazil': '🇧🇷', 'Las Vegas': '🇺🇸',
    'Qatar': '🇶🇦', 'Abu Dhabi': '🇦🇪',
};

export const NAT_MAP: Record<string, string> = {
    'British': '🇬🇧', 'Dutch': '🇳🇱', 'Monegasque': '🇲🇨', 'Mexican': '🇲🇽',
    'Spanish': '🇪🇸', 'Australian': '🇦🇺', 'Thai': '🇹🇭', 'Japanese': '🇯🇵',
    'German': '🇩🇪', 'French': '🇫🇷', 'Canadian': '🇨🇦', 'Danish': '🇩🇰',
    'Finnish': '🇫🇮', 'Chinese': '🇨🇳', 'American': '🇺🇸', 'Brazilian': '🇧🇷',
    'New Zealander': '🇳🇿', 'Italian': '🇮🇹',
};
