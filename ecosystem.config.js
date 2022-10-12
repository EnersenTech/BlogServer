module.exports = {
    apps: [
        {
            name: 'blog',
            script: 'app.js',
            watch: true, 
            env: {
                "PORT": 3000,
                "NODE_ENV": "development"
            },
            env_production: {
                "PORT": 80,
                "NODE_ENV": "production",
                "ACCESS_KEY":process.env.ACCESS_KEY,
                "REGION":process.env.REGION,
                "BUCKET":process.env.BUCKET   
            }
        }
    ]
}