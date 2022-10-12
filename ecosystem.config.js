module.exports = {
    apps: [
        {
            name: 'blog',
            script: 'app.js',
            watch: true, 
            env: {
                "PORT": 4000,
                "NODE_ENV": "development"
            },
            env_production: {
                "PORT": 5000,
                "NODE_ENV": "production",
                "ACCESS_KEY":process.env.ACCESS_KEY,
                "REGION":process.env.REGION,
                "BUCKET":process.env.BUCKET   
            }
        }
    ]
}