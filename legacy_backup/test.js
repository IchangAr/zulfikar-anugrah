const { createClient } = require('@supabase/supabase-js');
const config = require('./js/config.js');
// wait, config.js might set window._env_. I need to read the URL and KEY.
