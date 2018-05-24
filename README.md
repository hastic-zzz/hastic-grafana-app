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


# Usage

You should have [hastic-server](https://github.com/hastic/hastic-server) running to use anomaly detection.

- set [template variable](http://docs.grafana.org/reference/templating/) `$backendUrl` with URL of your hastic-server instance (e.g. `http://localhost:8000`) in your dashboard
- set metrics in `Metrics` tab
- go to `Analytics tab` and create new anomaly
- label your data:
  - click button with chart icon
  - highlight anomalies on graph holding Ctrl button
  - when you finished labeling - click button with chart icon once more
- you should see `Learning` status while hastic-server is learning (first learning can take a while)
- when `Learning` status dissapear - you should see anomalies labeled in your graph


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
