import type { Race } from './types';

export enum Drivers {
	Hamilton = 'Hamilton',
	Russell = 'Russell',
	Verstappen = 'Verstappen',
	Perez = 'Perez',
	Leclerc = 'Leclerc',
	Sainz = 'Sainz',
	Piastri = 'Piastri',
	Norris = 'Norris',
	Stroll = 'Stroll',
	Alonso = 'Alonso',
	Gasly = 'Gasly',
	Ocon = 'Ocon',
	DeVries = 'DeVries',
	Tsunoda = 'Tsunoda',
	Bottas = 'Bottas',
	Zhou = 'Zhou',
	Albon = 'Albon',
	Sargeant = 'Sargeant',
	Hulkenberg = 'Hulkenberg',
	Magnussen = 'Magnussen'
}

export enum Teams {
	Mercedes = 'Mercedes',
	RedBull = 'Red Bull',
	Ferrari = 'Ferrari',
	McLaren = 'McLaren',
	Alpine = 'Alpine',
	AstonMartin = 'Aston Martin',
	AlphaTauri = 'AlphaTauri',
	AlfaRomeo = 'AlfaRomeo',
	Williams = 'Williams',
	Haas = 'Haas'
}

export const teamColors: Record<Teams, string> = {
	[Teams.Mercedes]: '#009e8e',
	[Teams.RedBull]: '#0600ef',
	[Teams.Ferrari]: '#dc0000',
	[Teams.McLaren]: '#ff8700',
	[Teams.Alpine]: '#0090ff',
	[Teams.AstonMartin]: '#006f62',
	[Teams.AlphaTauri]: '#2b4562',
	[Teams.AlfaRomeo]: '#900000',
	[Teams.Williams]: '#005aff',
	[Teams.Haas]: '#666666'
};

export type Keys = Drivers | Teams;

export const driverTeams: Record<Drivers, Teams> = {
	[Drivers.Hamilton]: Teams.Mercedes,
	[Drivers.Russell]: Teams.Mercedes,
	[Drivers.Verstappen]: Teams.RedBull,
	[Drivers.Perez]: Teams.RedBull,
	[Drivers.Leclerc]: Teams.Ferrari,
	[Drivers.Sainz]: Teams.Ferrari,
	[Drivers.Piastri]: Teams.McLaren,
	[Drivers.Norris]: Teams.McLaren,
	[Drivers.Stroll]: Teams.Alpine,
	[Drivers.Alonso]: Teams.Alpine,
	[Drivers.Gasly]: Teams.AstonMartin,
	[Drivers.Ocon]: Teams.AstonMartin,
	[Drivers.DeVries]: Teams.AlphaTauri,
	[Drivers.Tsunoda]: Teams.AlphaTauri,
	[Drivers.Bottas]: Teams.AlfaRomeo,
	[Drivers.Zhou]: Teams.AlfaRomeo,
	[Drivers.Albon]: Teams.Williams,
	[Drivers.Sargeant]: Teams.Williams,
	[Drivers.Hulkenberg]: Teams.Haas,
	[Drivers.Magnussen]: Teams.Haas
};

export const teamDrivers = Object.entries(driverTeams).reduce((acc, [driver, team]) => {
	if (!acc[team]) {
		acc[team] = [];
	}
	acc[team].push(driver);
	return acc;
}, {}) as Record<Teams, Drivers[]>;

export const races: Race[] = [
	{
		name: 'Bahrain',
		odds: {
			Hamilton: { o1: 1600, o3: 275, o6: -300, o10: -350 },
			Russell: { o1: 2000, o3: 400, o6: -190, o10: -300 },
			Verstappen: { o1: -145, o3: -350, o6: -600, o10: -800 },
			Perez: { o1: 600, o3: -120, o6: -500, o10: -600 },
			Leclerc: { o1: 800, o3: -110, o6: -400, o10: -500 },
			Sainz: { o1: 1600, o3: 185, o6: -300, o10: -400 },
			Piastri: { o1: 50000, o3: 6600, o6: 800, o10: 160 },
			Norris: { o1: 25000, o3: 4000, o6: 350, o10: 100 },
			Stroll: { o1: 15000, o3: 3300, o6: 275, o10: -150 },
			Alonso: { o1: 500, o3: -165, o6: -500, o10: -600 },
			Gasly: { o1: 25000, o3: 5000, o6: 700, o10: 125 },
			Ocon: { o1: 25000, o3: 5000, o6: 550, o10: 120 },
			DeVries: { o1: 200000, o3: 15000, o6: 3300, o10: 225 },
			Tsunoda: { o1: 150000, o3: 15000, o6: 3300, o10: 250 },
			Bottas: { o1: 25000, o3: 3300, o6: 400, o10: -120 },
			Zhou: { o1: 25000, o3: 3300, o6: 500, o10: -120 },
			Albon: { o1: 200000, o3: 15000, o6: 4000, o10: 300 },
			Sargeant: { o1: 200000, o3: 20000, o6: 5000, o10: 500 },
			Hulkenberg: { o1: 25000, o3: 6600, o6: 900, o10: 160 },
			Magnussen: { o1: 25000, o3: 6600, o6: 900, o10: 160 }
		},
		results: [
			Drivers.Verstappen,
			Drivers.Perez,
			Drivers.Alonso,
			Drivers.Sainz,
			Drivers.Hamilton,
			Drivers.Stroll,
			Drivers.Russell,
			Drivers.Bottas,
			Drivers.Gasly,
			Drivers.Albon,
			Drivers.Tsunoda,
			Drivers.Sargeant,
			Drivers.Magnussen,
			Drivers.DeVries,
			Drivers.Hulkenberg,
			Drivers.Zhou,
			Drivers.Norris,
			Drivers.Ocon,
			Drivers.Leclerc,
			Drivers.Piastri,
		]
	},
	{
		name: 'Saudi Arabia',
		odds: {
			Hamilton: { o1: 4000, o3:350, o6:-275, o10: -500 },
			Russell: { o1: 4000, o3:400, o6:-225, o10: -500 },
			Verstappen: { o1: -350, o3:-500, o6:-600, o10: -800 },
			Perez: { o1: 500, o3:-250, o6:-450, o10: -500 },
			Leclerc: { o1: 2500, o3:200, o6:-275, o10: -450 },
			Sainz: { o1: 2000, o3:225, o6:-400, o10: -500 },
			Piastri: { o1: 200000, o3:20000, o6:2800, o10: 400 },
			Norris: { o1: 100000, o3:10000, o6:1400, o10: 150 },
			Stroll: { o1: 6600, o3:500, o6:-250, o10: -400 },
			Alonso: { o1: 900, o3:-150, o6:-400, o10: -500 },
			Gasly: { o1: 25000, o3:4000, o6:500, o10: -175 },
			Ocon: { o1: 25000, o3:4000, o6:500, o10: -175 },
			DeVries: { o1: 200000, o3:50000, o6:4000, o10: 400 },
			Tsunoda: { o1: 200000, o3:50000, o6:4000, o10: 250 },
			Bottas: { o1: 150000, o3:10000, o6:1400, o10: 200 },
			Zhou: { o1: 150000, o3:10000, o6:1400, o10: 225 },
			Albon: { o1: 100000, o3:6600, o6:1100, o10: 120 },
			Sargeant: { o1: 200000, o3:25000, o6:3300, o10: 400 },
			Hulkenberg: { o1: 150000, o3:10000, o6:1400, o10: 175 },
			Magnussen: { o1: 150000, o3:10000, o6:1400, o10: 175 }
		}
	},
];
