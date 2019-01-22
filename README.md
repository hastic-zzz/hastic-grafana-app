<p align="center">
  <a href=#hastic-grafana-app>
  <img width="auto" align="middle" height="120px" src="https://github.com/hastic/hastic-grafana-app/blob/master/src/img/hastic_graph.png" />
  <img hspace="50" align="middle" width="30%" height="30%" src="https://github.com/hastic/hastic-grafana-app/blob/master/src/img/hastic_logo.png" />
  </a>
</p>

# Hastic Graph Panel
[Website](https://hastic.io) |
[Twitter](https://twitter.com/hasticio) | 
[IRC](https://webchat.freenode.net/?channels=#hastic)

[![Build Status](https://travis-ci.org/hastic/hastic-grafana-app.svg?branch=master)](https://travis-ci.org/hastic/hastic-grafana-app)

A version of Grafana's default Graph Panel for rendering and labeling Hastic's patterns.

**Please note that we are still in alpha, so features are subject to change**

<img src="https://hastic.io/images/cpu_white.gif" />


See also:
* [Wiki](https://github.com/hastic/hastic-grafana-app/wiki)
* [FAQ](https://github.com/hastic/hastic-grafana-app/wiki/FAQ)
* [Installation from source](https://github.com/hastic/hastic-grafana-app/wiki/Installation-from-source)
* [Usage](https://github.com/hastic/hastic-grafana-app/wiki/Usage)
* [Changelog](https://github.com/hastic/hastic-grafana-app/wiki/Changelog)
* [Hastic-server](https://github.com/hastic/hastic-server)


# Prerequisites

* [hastic-server](https://github.com/hastic/hastic-server)
* [Grafana >= 5.1.1](https://grafana.com/grafana/download)

# Installation

- Navigate to /plugins directory in <GRAFANA_PATH>/data/plugins

- Download hastic graph panel
```
wget https://github.com/hastic/hastic-grafana-app/releases/download/0.2.7/hastic-grafana-app-0.2.7.tar.gz
```

- Unpack downloaded files
```
tar -zxvf hastic-grafana-app-0.2.7.tar.gz
```

- Restart grafana-server
  - For grafana installed via Standalone Linux Binaries:
    - Stop any running instances of grafana-server
    - Start grafana-server by:
      ```$GRAFANA_PATH/bin/grafana-server```
  - For grafana installed via Package Manager:
    - type in ```systemctl restart grafana-server```


# Credits

Based on 

* [grafana-plugin-template-webpack-typescript](https://github.com/CorpGlory/grafana-plugin-template-webpack-typescript) 
* [@types/grafana](https://github.com/CorpGlory/types-grafana)
