import React, {Component} from 'react';
import {Modal} from 'antd';

import './youtubeplayer.scss';

let Player, player, start, duration = 0;

export default class YoutubePlayer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false
    }
  }

  componentDidMount() {
    this.listenYoutubeReady();
  }

  componentWillReceiveProps(props) {
    if (!props.url) {
      player = null;
      return;
    }

    if (Player) {
      this.loadVideo(props.url);
    } else {
      const playerHandle = setTimeout(() => {
        if (Player) {
          this.loadVideo(props.url);
          clearTimeout(playerHandle);
        }
      }, 500);
    }
  }

  loadVideo(url) {
    this.setState({
      visible: true
    });
    setTimeout(() => {
      duration = 0;
      player = new Player('youtube-video', {
        videoId: this.getVideoId(url),
        events: {
          onReady: this.onPlayerReady,
          onStateChange: this.onPlayerStateChange.bind(this)
        }
      });
    });
  }

  listenYoutubeReady() {
    if (window.YTPlayer) {
      Player = window.YTPlayer;
    } else {
      window.addEventListener('youtube_ready', (e) => {
        Player = e.detail;
      });
    }
  }

  closePlayer() {
    if (start) {
      this.updateDuration();
    }
    this.setState({
      visible: false
    });
    player = null;
    this.props.onClose(duration);
  }

  onPlayerStateChange(event) {
    const status = event.data;
    if (status === YT.PlayerState.PLAYING) {
      start = this.now();
    } else if (status === YT.PlayerState.PAUSED || status === YT.PlayerState.ENDED) {
      this.updateDuration();
    }
  }

  updateDuration() {
    let diff = this.now() - start;
    duration += Math.floor(diff / 1000);
    start = null;
  }

  now() {
    return new Date().getTime();
  }

  onPlayerReady(event) {
    event.target.playVideo();
  }

  getVideoId(url) {
    return url.replace('https://www.youtube.com/watch?v=', '');
  }

  render() {
    return (
      <Modal
        visible={this.state.visible}
        onCancel={this.closePlayer.bind(this)}
        destroyOnClose={true}
        className="video-player"
        >
        <div id="youtube-video"/>
      </Modal>
    );
  }
}
