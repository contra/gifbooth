var React = require('react');
var events = require('add-event-listener');

var supported = ['webm', 'h264'];
var canPlayAny;
try {
  var testVideo = document.createElement('video');
  canPlayAny = supported.some(function(type){
    return testVideo.canPlayType('video/'+type);
  });
} catch (err) {
  console.log(err);
  canPlayAny = false;
}

var ChatMessage = React.createClass({
  displayName: 'ChatMessage',
  propTypes: {
    id: React.PropTypes.string.isRequired,
    url: React.PropTypes.string.isRequired,
    text: React.PropTypes.string
  },

  getInitialState: function() {
    return {
      videoError: null
    };
  },

  setLoadError: function(e) {
    console.log(e);
    this.setState({
      videoError: e
    });
  },
  componentDidMount: function() {
    var el = this.refs.video.getDOMNode();
    events.addEventListener(el, 'error', this.setLoadError);
  },
  componentWillUnmount: function() {
    var el = this.refs.video.getDOMNode();
    events.removeEventListener(el, 'error', this.setLoadError);
  },
  render: function() {
    if (this.state.videoError) {
      return null;
    }

    var gif = React.DOM.img({
      ref: 'video-gif-source',
      key: 'video-gif-source-'+this.props.id,
      src: this.props.url + '.gif',
      className: 'chat-message-video'
    });

    var sources = supported.map(function(ext){
      return React.DOM.source({
        ref: 'video-'+ext+'-source',
        key: 'video-'+ext+'-source-'+this.props.id,
        src: this.props.url + '.' + ext,
        type: 'video/' + ext
      });
    }, this);

    var vid = React.DOM.video({
      ref: 'video',
      key: 'video-'+this.props.id,
      loop: true,
      controls: false,
      autoPlay: true,
      className: 'chat-message-video'
    }, sources);

    var msg = this.props.text ? React.DOM.div({
      ref: 'text',
      key: 'text-'+this.props.id,
      className: 'chat-message-text'
    }, this.props.text) : null;

    var media = canPlayAny ? vid : gif;

    return React.DOM.div({
      ref: 'container-'+this.props.id,
      className: 'chat-message'
    }, [media, msg]);
  }
});

module.exports = ChatMessage;