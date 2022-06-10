import type { Race } from './types';

export enum Drivers {
	Hamilton = 'Hamilton',
	Russell = 'Russell',
	Verstappen = 'Verstappen',
	Perez = 'Perez',
	Leclerc = 'Leclerc',
	Sainz = 'Sainz',
	Norris = 'Norris',
	Ricciardo = 'Ricciardo',
	Alonso = 'Alonso',
	Ocon = 'Ocon',
	Stroll = 'Stroll',
	Vettel = 'Vettel',
	Gasly = 'Gasly',
	Tsunoda = 'Tsunoda',
	Bottas = 'Bottas',
	Zhou = 'Zhou',
	Albon = 'Albon',
	Latifi = 'Latifi',
	Schumacher = 'Schumacher',
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
	[Drivers.Norris]: Teams.McLaren,
	[Drivers.Ricciardo]: Teams.McLaren,
	[Drivers.Alonso]: Teams.Alpine,
	[Drivers.Ocon]: Teams.Alpine,
	[Drivers.Stroll]: Teams.AstonMartin,
	[Drivers.Vettel]: Teams.AstonMartin,
	[Drivers.Gasly]: Teams.AlphaTauri,
	[Drivers.Tsunoda]: Teams.AlphaTauri,
	[Drivers.Bottas]: Teams.AlfaRomeo,
	[Drivers.Zhou]: Teams.AlfaRomeo,
	[Drivers.Albon]: Teams.Williams,
	[Drivers.Latifi]: Teams.Williams,
	[Drivers.Schumacher]: Teams.Haas,
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
		name: 'Australia',
		odds: {
			Hamilton: { o1: 2500, o3: 350, o6: -200, o10: -400 },
			Russell: { o1: 6600, o3: 700, o6: -175, o10: -300 },
			Verstappen: { o1: 150, o3: -400, o6: -600, o10: -700 },
			Perez: { o1: 1600, o3: 175, o6: -400, o10: -600 },
			Leclerc: { o1: 135, o3: -400, o6: -600, o10: -700 },
			Sainz: { o1: 400, o3: -160, o6: -500, o10: -700 },
			Ricciardo: { o1: 15000, o3: 1400, o6: 300, o10: -120 },
			Norris: { o1: 10000, o3: 1400, o6: 250, o10: -150 },
			Stroll: { o1: 200000, o3: 25000, o6: 6600, o10: 400 },
			Vettel: { o1: 100000, o3: 20000, o6: 5000, o10: 350 },
			Alonso: { o1: 6600, o3: 1200, o6: 200, o10: -250 },
			Ocon: { o1: 6600, o3: 1200, o6: 200, o10: -250 },
			Gasly: { o1: 15000, o3: 1400, o6: 300, o10: -165 },
			Tsunoda: { o1: 25000, o3: 2000, o6: 1200, o10: 120 },
			Bottas: { o1: 12500, o3: 1400, o6: 300, o10: -175 },
			Zhou: { o1: 50000, o3: 10000, o6: 2500, o10: 225 },
			Albon: { o1: 200000, o3: 100000, o6: 50000, o10: 1200 },
			Latifi: { o1: 300000, o3: 200000, o6: 50000, o10: 2800 },
			Schumacher: { o1: 25000, o3: 2000, o6: 300, o10: 150 },
			Magnussen: { o1: 25000, o3: 2000, o6: 300, o10: 125 }
		},
		results: [
			Drivers.Leclerc,
			Drivers.Perez,
			Drivers.Russell,
			Drivers.Hamilton,
			Drivers.Norris,
			Drivers.Ricciardo,
			Drivers.Ocon,
			Drivers.Bottas,
			Drivers.Gasly,
			Drivers.Albon,
			Drivers.Zhou,
			Drivers.Stroll,
			Drivers.Schumacher,
			Drivers.Magnussen,
			Drivers.Tsunoda,
			Drivers.Latifi,
			Drivers.Alonso,
			Drivers.Verstappen,
			Drivers.Vettel,
			Drivers.Sainz
		]
	},
	{
		name: 'Italy',
		odds: {
			Hamilton: { o1: 1100, o3: 200, o6: -275, o10: -500 },
			Russell: { o1: 3300, o3: 450, o6: -225, o10: -400 },
			Verstappen: { o1: 175, o3: -300, o6: -400, o10: -500 },
			Perez: { o1: 1400, o3: 125, o6: -275, o10: -500 },
			Leclerc: { o1: 110, o3: -350, o6: -500, o10: -600 },
			Sainz: { o1: 700, o3: -135, o6: -300, o10: -500 },
			Ricciardo: { o1: 10000, o3: 1200, o6: 175, o10: -250 },
			Norris: { o1: 8000, o3: 900, o6: 135, o10: -300 },
			Stroll: { o1: 100000, o3: 25000, o6: 5000, o10: 600 },
			Vettel: { o1: 100000, o3: 25000, o6: 5000, o10: 600 },
			Alonso: { o1: 8000, o3: 900, o6: 135, o10: -300 },
			Ocon: { o1: 15000, o3: 1400, o6: 250, o10: -250 },
			Gasly: { o1: 25000, o3: 2200, o6: 300, o10: -165 },
			Tsunoda: { o1: 50000, o3: 6600, o6: 1400, o10: 225 },
			Bottas: { o1: 25000, o3: 3300, o6: 333, o10: -150 },
			Zhou: { o1: 50000, o3: 20000, o6: 2500, o10: 275 },
			Albon: { o1: 100000, o3: 100000, o6: 10000, o10: 700 },
			Latifi: { o1: 200000, o3: 150000, o6: 25000, o10: 2500 },
			Schumacher: { o1: 50000, o3: 5000, o6: 500, o10: 150 },
			Magnussen: { o1: 50000, o3: 5000, o6: 500, o10: 125 }
		}
	},
	{
		name: 'Spain',
		odds: {
			Hamilton: { o1: 2500, o3: 275, o6: -275, o10: -350 },
			Russell: { o1: 2000, o3: 275, o6: -275, o10: -350 },
			Verstappen: { o1: 120, o3: -275, o6: -450, o10: -600 },
			Perez: { o1: 2000, o3: 175, o6: -275, o10: -400 },
			Leclerc: { o1: 120, o3: -400, o6: -500, o10: -600 },
			Sainz: { o1: 800, o3: -175, o6: -350, o10: -400 },
			Ricciardo: { o1: 20000, o3: 2000, o6: 250, o10: -120 },
			Norris: { o1: 10000, o3: 1000, o6: 150, o10: -200 },
			Stroll: { o1: 100000, o3: 20000, o6: 2000, o10: 150 },
			Vettel: { o1: 100000, o3: 20000, o6: 1400, o10: 100 },
			Alonso: { o1: 10000, o3: 1000, o6: 125, o10: -200 },
			Ocon: { o1: 20000, o3: 2000, o6: 300, o10: -140 },
			Gasly: { o1: 50000, o3: 4000, o6: 450, o10: 100 },
			Tsunoda: { o1: 100000, o3: 20000, o6: 2000, o10: 175 },
			Bottas: { o1: 6600, o3: 800, o6: 110, o10: -250 },
			Zhou: { o1: 150000, o3: 20000, o6: 3300, o10: 300 },
			Albon: { o1: 150000, o3: 20000, o6: 4000, o10: 500 },
			Latifi: { o1: 300000, o3: 30000, o6: 20000, o10: 2500 },
			Schumacher: { o1: 150000, o3: 20000, o6: 3300, o10: 150 },
			Magnussen: { o1: 100000, o3: 20000, o6: 1000, o10: 150 }
		},
		results: [
			Drivers.Verstappen,
			Drivers.Perez,
			Drivers.Russell,
			Drivers.Sainz,
			Drivers.Hamilton,
			Drivers.Bottas,
			Drivers.Ocon,
			Drivers.Norris,
			Drivers.Alonso,
			Drivers.Tsunoda,
			Drivers.Vettel,
			Drivers.Ricciardo,
			Drivers.Schumacher,
			Drivers.Gasly,
			Drivers.Stroll,
			Drivers.Latifi,
			Drivers.Magnussen,
			Drivers.Albon,
			Drivers.Zhou,
			Drivers.Leclerc
		]
	},
	{
		name: 'Monaco',
		odds: {
			Hamilton: { o1: 2500, o3: 450, o6: -175, o10: -300 },
			Russell: { o1: 2000, o3: 400, o6: -175, o10: -350 },
			Verstappen: { o1: 275, o3: -250, o6: -400, o10: -600 },
			Perez: { o1: 1400, o3: 175, o6: -300, o10: -400 },
			Leclerc: { o1: -140, o3: -300, o6: -450, o10: -600 },
			Sainz: { o1: 550, o3: -135, o6: -300, o10: -500 },
			Ricciardo: { o1: 25000, o3: 1200, o6: 600, o10: 125 },
			Norris: { o1: 5000, o3: 450, o6: -150, o10: -350 },
			Stroll: { o1: 200000, o3: 10000, o6: 2000, o10: 400 },
			Vettel: { o1: 50000, o3: 3300, o6: 1100, o10: -120 },
			Alonso: { o1: 50000, o3: 1400, o6: 400, o10: -150 },
			Ocon: { o1: 100000, o3: 4000, o6: 1000, o10: 135 },
			Gasly: { o1: 10000, o3: 800, o6: -110, o10: -300 },
			Tsunoda: { o1: 50000, o3: 3300, o6: 1000, o10: 125 },
			Bottas: { o1: 20000, o3: 800, o6: 110, o10: -165 },
			Zhou: { o1: 200000, o3: 10000, o6: 2500, o10: 400 },
			Albon: { o1: 200000, o3: 25000, o6: 5000, o10: 500 },
			Latifi: { o1: 300000, o3: 50000, o6: 20000, o10: 1000 },
			Schumacher: { o1: 200000, o3: 4000, o6: 1100, o10: 250 },
			Magnussen: { o1: 50000, o3: 2500, o6: 400, o10: -135 }
		},
		results: [
			Drivers.Perez,
			Drivers.Sainz,
			Drivers.Verstappen,
			Drivers.Leclerc,
			Drivers.Russell,
			Drivers.Norris,
			Drivers.Alonso,
			Drivers.Hamilton,
			Drivers.Bottas,
			Drivers.Vettel,
			Drivers.Gasly,
			Drivers.Ocon,
			Drivers.Ricciardo,
			Drivers.Stroll,
			Drivers.Latifi,
			Drivers.Zhou,
			Drivers.Albon,
			Drivers.Tsunoda,
			Drivers.Schumacher,
			Drivers.Magnussen,
		]
	},
	{
		name: 'Baku',
		odds: {
			Hamilton: { o1: 4000, o3: 500, o6: -175, o10: -400 },
			Russell: { o1: 3300, o3: 450, o6: -190, o10: -400 },
			Verstappen: { o1: 110, o3: -400, o6: -450, o10: -700 },
			Perez: { o1: 550, o3: -175, o6: -350, o10: -600 },
			Leclerc: { o1: 150, o3: -300, o6: -400, o10: -700 },
			Sainz: { o1: 1400, o3: 150, o6: -300, o10: -600 },
			Ricciardo: { o1: 50000, o3: 3300, o6: 600, o10: 150 },
			Norris: { o1: 10000, o3: 1000, o6: 120, o10: -225 },
			Stroll: { o1: 100000, o3: 10000, o6: 2000, o10: 275 },
			Vettel: { o1: 50000, o3: 5000, o6: 700, o10: 135 },
			Alonso: { o1: 6600, o3: 800, o6: 100, o10: -250 },
			Ocon: { o1: 25000, o3: 3300, o6: 400, o10: -150 },
			Gasly: { o1: 10000, o3: 1600, o6: 225, o10: -200 },
			Tsunoda: { o1: 25000, o3: 5000, o6: 700, o10: -120 },
			Bottas: { o1: 15000, o3: 1200, o6: 150, o10: -175 },
			Zhou: { o1: 100000, o3: 10000, o6: 2500, o10: 400 },
			Albon: { o1: 200000, o3: 50000, o6: 5000, o10: 550 },
			Latifi: { o1: 300000, o3: 100000, o6: 10000, o10: 2500 },
			Schumacher: { o1: 100000, o3: 5000, o6: 1600, o10: 400 },
			Magnussen: { o1: 50000, o3: 3300, o6: 600, o10: 150 }
		}
	}
];
