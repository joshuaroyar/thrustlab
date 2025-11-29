export type TurbofanComponentGroup = {
	id: string;
	label: string;
	colorHint: string;
	description: string;
	keys: string[];
};

const componentGroups: TurbofanComponentGroup[] = [
	{
		id: 'fan-rotor',
		label: 'Fan Rotor (Light Blue)',
		colorHint: 'Light blue front assembly and semi-circular rear shroud',
		description:
			'The fan rotor is the first rotor in the compressor. Its primary task is to accelerate a large mass flow of air in the bypass flow and thus provide the main thrust. This light-blue assembly covers both the front rotor and the semi-circular fairing that channels bypass air.',
		keys: ['Material.046', 'Material.006', 'Material.007', 'fan', 'Fan Rotor', 'FanRotor', 'Light Blue', 'LightBlue']
	},
	{
		id: 'gearbox',
		label: 'Gearbox (Metallic Grey)',
		colorHint: 'Metallic grey module coupling fan and turbine',
		description:
			'In geared turbofan engines, the gearbox decouples the low-pressure turbine and the fan so that each can spin at its most efficient speed. In conventional engines these components sit on one shaft, but the gearbox enables higher efficiency and quieter operation.',
		keys: ['Material.018', 'Gearbox', 'gearbox', 'Metallic Grey']
	},
	{
		id: 'low-pressure-compressor',
		label: 'Low-Pressure Compressor (Green)',
		colorHint: 'Green stages ahead of the core',
		description:
			'The task of the compressors is to ingest air and compress it before it is fed into the combustor. The low-pressure compressor is responsible for precompressing the air and delivering a smooth, energized stream into the high-pressure section.',
		keys: [
			'Material.008',
			'Material.009',
			'Material.010',
			'Material.011',
			'Material.012',
			'Material.013',
			'Material.014',
			'Material.015',
			'Material.016',
			'Material.017',
			'Material.020',
			'Material.049',
			'LowPressureCompressor',
			'LPC',
			'low-pressure compressor'
		]
	},
	{
		id: 'high-pressure-compressor',
		label: 'High-Pressure Compressor (Yellow)',
		colorHint: 'Yellow/gold bladed stages in the core',
		description:
			'The high-pressure compressor handles the main compression duty. In advanced turbofan engines, the blades and disk can be manufactured as a single part - known as a blisk - for improved efficiency, strength, and reduced maintenance.',
		keys: [
			'Material.022',
			'Material.023',
			'Material.024',
			'Material.025',
			'Material.026',
			'Material.027',
			'Material.028',
			'Material.029',
			'Material.044',
			'Material.045',
			'Material.048',
			'HighPressureCompressor',
			'HPC',
			'high-pressure compressor'
		]
	},
	{
		id: 'high-pressure-turbine',
		label: 'High-Pressure Turbine (Orange)',
		colorHint: 'Orange turbine stages right after the combustor',
		description:
			'Inside the turbine, the energy contained in the hot, high-pressure gases leaving the combustor is converted into mechanical energy. The high-pressure turbine, comprising multiple blades, drives the high-pressure compressor.',
		keys: [
			'Material.047',
			'Material.030',
			'Material.031',
			'Material.032',
			'Material.033',
			'Material.034',
			'Material.035',
			'Material.036',
			'Material.037',
			'Material.038',
			'Material.039',
			'Material.040',
			'HighPressureTurbine',
			'HPT',
			'high-pressure turbine'
		]
	},
	{
		id: 'combustor',
		label: 'Combustor (Grey Core)',
		colorHint: 'Grey ring in the middle back part of the engine',
		description:
			'Inside the combustor, the compressed air flowing into the chamber is mixed with fuel, where it burns at about 1,700 degrees Celsius. The combustor prepares the high-energy gas stream that drives the turbine stages downstream.',
		keys: ['Material.019', 'Material.021', 'Combustor', 'Combustion Chamber']
	},
	{
		id: 'low-pressure-turbine',
		label: 'Low-Pressure Turbine (Dark Blue)',
		colorHint: 'Dark blue stages at the rear of the engine',
		description:
			'The low-pressure turbine drives both the low-pressure compressor and the fan, which generates the bulk of the thrust. In geared turbofan architectures it spins significantly faster than in conventional turbofan engines.',
		keys: ['Material.041', 'Material.042', 'Material.043', 'LowPressureTurbine', 'LPT', 'low-pressure turbine']
	}
];

export const turbofanComponentGroups = componentGroups;

export const turbofanPartDescriptions: Record<string, { name: string; description: string }> =
	componentGroups.reduce((acc, group) => {
		for (const key of group.keys) {
			acc[key] = { name: group.label, description: group.description };
		}
		return acc;
	}, {} as Record<string, { name: string; description: string }>);
