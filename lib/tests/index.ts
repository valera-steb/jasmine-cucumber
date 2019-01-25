const r = require.context('./', true, /\.test\.ts$/);
r.keys().forEach(r);