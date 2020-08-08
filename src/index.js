import ReactDOM from 'react-dom';
import React, {Component} from 'react';
import {w3cwebsocket} from "websocket"
import 'antd/dist/antd.css'
import {Input, Typography, Card, Avatar} from "antd";
import './index.css';

const {Search} = Input;
const {Text} = Typography;
const {Meta} = Card;
const client = new w3cwebsocket('ws://127.0.0.1:8000')

export default class App extends Component {
    state = {
        userName: '',
        isLoggedIn: false,
        messages: []
    }
    onButtonClicked = (value) => {
        console.log("Button clicked with message: ", value)
        client.send(JSON.stringify({
            type: "message",
            msg: value,
            user: this.state.userName
        }))
        this.setState({searchVal: ''})
    }

    componentDidMount() {
        client.onopen = () => {
            console.log('WebSocket client connected')
        }
        client.onmessage = (message) => {
            console.log('got reply: ', message)
            const dataFromServer = JSON.parse(message.data)
            console.log('got reply: ', dataFromServer)
            if (message.type === 'message') {
                this.setState((state) => ({
                    messages: [...state.messages, {
                        msg: dataFromServer.msg,
                        user: dataFromServer.user
                    }]
                }))
            }
        }
    }

    render() {
        return (

            <div className="main">
                {console.log("state: ", this.state)}
                {this.state.isLoggedIn ?
                    <div>
                        <div className="title">
                            <Text type="secondary" style={{fontSize: '36px'}}> Let's play Taboo! </Text>
                        </div>
                        <div style={{display: 'flex', flexDirection: 'column', paddingBottom: '10px'}}>
                            {this.state.messages.map(message =>
                                <Card
                                    key={message.msg}
                                    style={{width: 300, margin: '16px 4px 0 4px', alignSelf: this.state.userName === message.user ? 'flex-end': 'flex-start'
                                    }}
                                >
                                    <Meta
                                        avatar={<Avatar style={{color: '#f56a00', backgroundColor: '#fde3cf'}}/>}
                                        title={message.user}
                                        description={message.msg}
                                    />
                                </Card>
                            )
                            }
                        </div>
                        <div className="bottom">
                            <Search
                                placeholder="Write your message here..."
                                enterButton="Send"
                                value={this.state.searchVal}
                                size="large"
                                onChange={(e) => this.setState({searchVal: e.target.value})}
                                onSearch={value => this.onButtonClicked(value)}
                            >
                            </Search>
                        </div>
                    </div>
                    :
                    <div style={{padding: '200px 50px'}}>
                        <Search
                            placeholder="Enter Username"
                            enterButton="Login"
                            size="Large"
                            onSearch={value => this.setState({
                                isLoggedIn: true,
                                userName: value
                            })}
                        >
                        </Search>
                    </div>
                }
            </div>
        )
    }
}

ReactDOM.render(<App/>, document.getElementById('root'))