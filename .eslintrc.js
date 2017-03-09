module.exports = {
    "extends": "videoamp",
    "installedESLint": true,
    "plugins": [
        "angular"
    ],
    "rules": {
      "comma-dangle": ["error", "never"],
      "no-console": 0, // because it's annoying for now
      "no-param-reassign": ["error", { "props": false }]
    },
    "globals": {
      "document": true,
      "window": true,
      "Plotly": true,
      "angular": true,
      "localStorage": true,
      "describe": true,
      "beforeEach": true,
      "it": true,
      "expect": true,
      "inject": true,
      "jasmine": true
    }
};
