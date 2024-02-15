let cache = {};

function set(key, value, ttl = 60) {
  cache[key] = {
    value: value,
    expiry: Date.now() + ttl * 1000,
  };
}

function get(key) {
  const entry = cache[key];
  if (entry && entry.expiry > Date.now()) {
    return entry.value;
  } else {
    delete cache[key];
    return null;
  }
}

module.exports = { set, get };
