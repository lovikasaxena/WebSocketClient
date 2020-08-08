import ReactDOM from 'react-dom';
import React, {Component} from 'react';
import {w3cwebsocket} from "websocket"
import 'antd/dist/antd.css'
import {Avatar, Card, Input, List, Typography} from "antd";
import './index.css';
import Header from "./Header";

const {Search} = Input;
const {Text} = Typography;
const {Meta} = Card;
const client = new w3cwebsocket('ws://127.0.0.1:8000')

export default class App extends Component {
    state = {
        userName: '',
        isLoggedIn: false,
        messages: [],
        playerUserNames: []
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

    onLogin = (value) => {
        console.log("login ", value)
        this.setState({
            isLoggedIn: true,
            userName: value,
            searchVal: ''
        })
        client.send(JSON.stringify({
            type: "newPlayer",
            userName: value
        }))
    }

    componentDidMount() {
        client.onopen = () => {
            console.log('WebSocket client connected')
        }
        client.onmessage = (notification) => {
            console.log('got notification: ', notification)
            const dataFromServer = JSON.parse(notification.data)
            if (notification.type === 'message') {
                if (dataFromServer.type === 'allPlayers') {
                    console.log('all players: ', dataFromServer)
                    this.setState((state) => ({
                        playerUserNames: [dataFromServer.playerUserNames]
                    }))
                } else if (dataFromServer.type === 'newPlayer') {
                    console.log('new player: ', dataFromServer)
                    this.setState((state) => ({
                        playerUserNames: [...this.state.playerUserNames, dataFromServer.userName]
                    }))
                }
                else if (dataFromServer.type === 'message') {
                    console.log('Adding message to client: ', notification)
                    this.setState((state) => ({
                        messages: [...state.messages, {
                            msg: dataFromServer.msg,
                            user: dataFromServer.user
                        }]
                    }))
                }
            }
        }
    }

    render() {
        return (
            <div className="main">
                {console.log("state: ", this.state)}
                {this.state.isLoggedIn ?
                    <div class="row">
                        <Header/>
                        <div class="column" style={{
                            display: 'flex',
                            flexDirection: 'column',
                            paddingBottom: '10px',
                            paddingTop: '20px'
                        }}>
                            {this.state.playerUserNames.length ? this.state.playerUserNames.map(id =>
                                <Card
                                    key={id}
                                    style={{
                                        width: 300,
                                        margin: '0px 0px 0px 20px',
                                        alignSelf: 'flex-start'
                                    }}
                                >
                                    <Meta
                                        avatar={<Avatar style={{color: '#f56a00', backgroundColor: '#fde3cf'}}/>}
                                        title={id}
                                    />
                                </Card>
                            ): ''}
                        </div>
                        <div className="column">
                            <div className="comment-box"
                                 style={{
                                     // display: 'flex', flexDirection: 'column',
                                     // margin: '0px 10px 0px 4px',
                                     // paddingBottom: '10px', paddingTop: '20px', alignSelf: 'flex-end'
                                 }}>
                                {this.state.messages.map(message =>
                                    <List
                                        key={message.msg}
                                        style={{
                                            width: 300,
                                            margin: '0px 0px 0 10px',
                                        }}
                                    >
                                        <b>{message.user}</b>: {message.msg}
                                    </List>
                                )
                                }
                            </div>
                                <div className="answer-input">
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
                    </div>
                    :
                    <div>
                        <Header></Header>
                        <div style={{padding: '100px 500px'}}>
                            <Search
                                placeholder="Enter Username"
                                enterButton="Play"
                                size="Small"
                                onSearch={value => this.onLogin(value)}
                            >
                            </Search>
                        </div>
                    </div>
                }
            </div>
        )
    }
}

ReactDOM.render(<App/>, document.getElementById('root'))