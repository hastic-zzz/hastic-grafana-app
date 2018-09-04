<p align="center" cursor: auto>
  <a href=#>
  <img width="auto" align="middle" height="120px" src="https://github.com/hastic/hastic-grafana-graph-panel/blob/master/src/img/hastic_graph.png" />
  <img hspace="50" align="middle" width="30%" height="30%" src="https://github.com/hastic/hastic-grafana-graph-panel/blob/master/src/img/hastic_logo.png" />
  </a>
</p>

# Hastic Graph Panel

A better version of Grafana's default Graph Panel. Able to render Anomalies & more.

**Please note that we are still in alpha, so features are subject to change**

<img src="https://hastic.io/images/cpu_white.gif" />

# Prerequisites

* [hastic-server](https://github.com/hastic/hastic-server)
* [Grafana >= 5.1.1](https://grafana.com/grafana/download)

# Installation

- Navigate to /plugins directory in <GRAFANA_PATH>/data/plugins

- Download hastic graph panel
```
wget https://github.com/hastic/hastic-grafana-graph-panel/releases/download/0.2.0/hastic-graph-panel-0.2.0.tar.gz
```

- Unpack downloaded files
```
tar -zxvf hastic-graph-panel-0.2.0.tar.gz
```

- Restart grafana-server
  - For grafana installed via Standalone Linux Binaries:
    - Stop any running instances of grafana-server
    - Start grafana-server by:
      ```$GRAFANA_PATH/bin/grafana-server```
  - For grafana installed via Package Manager:
    - type in ```systemctl restart grafana-server```

# Installation from source

**Note, that <GRAFANA_PATH>/data/plugins directory will NOT be present until grafana-server was started at least once!**

**Also possible to create directory manually by typing:**
```
mkdir -p data/plugins
```

- Navigate to /plugins directory in <GRAFANA_PATH>/data/plugins
```
cd $GRAFANA_PATH/data/plugins
```

- Clone the repository
```
git clone https://github.com/hastic/hastic-grafana-graph-panel.git
```

- Navigate to /hastic-grafana-graph-panel directory
```
cd $GRAFANA_PATH/data/plugins/hastic-grafana-graph-panel
```

- Install necessary dependencies
```
npm install
```

- Build hastic graph panel
```
npm run build
```

- Restart grafana-server
  - For grafana installed via Standalone Linux Binaries:
    - Stop any running instances of grafana-server
    - Start grafana-server by:
      ```$GRAFANA_PATH/bin/grafana-server```
  - For grafana installed via Package Manager:
    - type in ```systemctl restart grafana-server```

# Usage

[hastic-server](https://github.com/hastic/hastic-server) should be running in order to use anomaly detection.

- Open new dasboard where you want to see Hastic panel
- Open Dashboard `Settings` (top right corner) and then navigate to `Variables` 
- Add new [variable](http://docs.grafana.org/reference/templating/#variable-types) 
  - set `type` to `Constant`
  - set `name` to `HASTIC_SERVER_URL` 
  - set `value` to URL of your hastic-server instance in your dashboard (e.g. `http://localhost:8000`)
- Save settings and close Settings window
- Open panel edit mode (click `panel title`menu or press "e" hotkey)
- Navigate to `Metrics` tab. Set metrics. Only one metric suported
- Navigate to `Analytics tab`
  - Push `Add an Anomaly Type` button
  - Set name of the anomaly and choose a pattern type
  - Press `create`
- Label your data:
  - Click button with chart icon
  - Highlight anomalies on graph holding `Ctrl` button on Windows or `Cmd` on Mac
  - When you have finished labeling - click the button with the chart icon once more. `saving...` status should appear.
- `Learning` status should appear while hastic-server is learning (first learning can take a while).
- When `Learning` status dissapears - the anomalies should become labeled in your graph
- <img src="assets/mag_icon_light.png" /> this icon means that the anomaly was marked by the server
- <img src="assets/pin_icon_light.png" /> this icon means that the anomaly was marked by the user


# Development

## Build

```
npm install
npm run build
```


# Changelog

### [0.2.0] - 2018-09-03
> Supports only hastic-server of versions **0.2.0-alpha or greater**
#### Fixed
- Wrong colors order [#49](https://github.com/hastic/hastic-grafana-graph-panel/issues/49)
- No crosshair [#50](https://github.com/hastic/hastic-grafana-graph-panel/issues/50)
- Analytic unit ID in tooltip instead of name [#56](https://github.com/hastic/hastic-grafana-graph-panel/issues/56)

### [0.1.0] - 2018-07-17
> Supports only hastic-server of versions **0.2.0-alpha or greater**
#### Fixed
- Choosing custom color for analytic unit [#31](https://github.com/hastic/hastic-grafana-graph-panel/issues/31)
- Deleting any analytic unit only deletes the first one [#33](https://github.com/hastic/hastic-grafana-graph-panel/issues/33)
- Problems with Singlestat and Piechart panels [#42](https://github.com/hastic/hastic-grafana-graph-panel/issues/42)

# Credits

Based on 

* [grafana-plugin-template-webpack-typescript](https://github.com/CorpGlory/grafana-plugin-template-webpack-typescript) 
* [@types/grafana](https://github.com/CorpGlory/types-grafana)
