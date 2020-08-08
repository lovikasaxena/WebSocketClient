import React, {Component} from "react";
import Text from "antd/es/typography/Text";

export default class Header extends Component {
    render() {
        return (<div className="title">
            <Text type="secondary" style={{fontSize: '36px'}}> Let's play Taboo! </Text>
        </div>)
    }
}

