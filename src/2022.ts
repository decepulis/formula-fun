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
		}
	}
];
