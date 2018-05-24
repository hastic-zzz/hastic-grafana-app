# Hastic Graph Panel

A better version of default Grafana's Graph Panel. Can render Anomalies & more.
In order to detect anomalies and make predictions, you need to install: https://github.com/hastic/hastic-server

# Installation

Clone repo
```
cd $GRAFANA_PATH/data/plugins
git clone git@github.com:hastic/hastic-grafana-graph-panel.git
```

and restart your `$GRAFANA_PATH/bin/grafana-server` server.



# Development

## Build

```
npm install
npm run build
```


# Changelog

[Improvements]

* You can zoom during update


# Credits

Based on 

* [grafana-plugin-template-webpack-typescript](https://github.com/CorpGlory/grafana-plugin-template-webpack-typescript) 
* [@types/grafana](https://github.com/CorpGlory/types-grafana)
