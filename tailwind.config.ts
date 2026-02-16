import type { Config } from "tailwindcss";

const { fontFamily } = require("tailwindcss/defaultTheme");

const config = {
	darkMode: ["class"],
	corePlugins: {
		preflight: false, // Disables Tailwind's default CSS reset
	},
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		// container: {
		// 	center: true,
		// 	padding: '2rem',
		// 	screens: {}
		// },
		extend: {
			colors: {
				// primary: {
				// 	'100': '#739E73'
				// },
				// red: {
				// 	'100': '#EB333C'
				// },
				// black: {
				// 	'100': '#222222'
				// },
				// success: {
				// 	'100': '#037847'
				// },
				// bodyText: {
				// 	'100': '#4A4A68'
				// },
				// grey: {
				// 	'100': '#92949F'
				// },
				// lightColor: {
				// 	'100': '#F2F4F7'
				// },
				// indicatorBg: {
				// 	'1': '#ECFEF7'
				// },
				// Biege: {
				// 	'1': '#FBFBFB'
				// },
				// stroke: {
				// 	'1': '#D0D5DD'
				// },
				educ8_white: {
					'1': '#FAFAFA'
				},

				///////////////////////
				/////////SHADCN////////
				///////////////////////
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			fontFamily: {
				inter: [
					'var(--font-inter)',
					...(fontFamily?.inter || [])
				]
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'caret-blink': {
					'0%,70%,100%': {
						opacity: '1'
					},
					'20%,50%': {
						opacity: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'caret-blink': 'caret-blink 1.25s ease-out infinite'
			},
			textInputs: [
				'number'
			]
		}
	},
	plugins: [
		require("tailwindcss-animate"),
		function ({
			addUtilities,
		}: {
			addUtilities: (utilities: Record<string, any>) => void;
		}) {
			const newUtilities = {
				".remove-number-spinner": {
					"&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
						"-webkit-appearance": "none",
						margin: "0",
					},
					'&[type="number"]': {
						"-moz-appearance": "textfield",
					},
				},
			};
			addUtilities(newUtilities);
		},
	],
} satisfies Config;

export default config;