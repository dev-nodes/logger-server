module.exports = {
  apps: [{
    name: "Logger",
    script: "index.js",
    exec_mode: "fork",
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: "1G",
    "node_args": "-r dotenv/config",
    "args": "--color",
    time: true
  }],

};
