module.exports = {
	apps : [{
		name: 'wikipedia-bot',
		script: './cluster.js',
		env: {
			NODE_ENV: 'development',
		},
		env_production: {
			NODE_ENV: 'production',
		},
	}],
}
