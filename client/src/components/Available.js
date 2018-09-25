import React from 'react'
import axios from 'axios'
import {
  List,
  Header,
  Table,
} from 'semantic-ui-react'
import Scroller from 'react-infinite-scroller'

const styles = {
  scroller: { height: '80vh', overflow: 'auto' }
}

class Available extends React.Component {
  state = { agents: [], total_pages: 1, page: 1 }

  componentDidMount() {
    axios.get('/api/properties')
      .then( ({ data }) => { 
        const agents = this.normalizeData(data.properties)
        this.setState({ agents, total_pages: data.total_pages })
      })
  }

  normalizeData = (data) => {
    let agents = [];
    let ids = [...new Set(data.map( d => d.agent_id ))]
    ids.map( id => {
      let properties = data.filter( d => d.agent_id === id );
      let { agent_id, first_name, last_name, email, phone } = properties[0];
      let agentProperties = properties.map( p => {
        let { price, beds, baths, sq_ft, city, street, zip, id } = p
        return { price, beds, baths, sq_ft, city, street, zip, id }
      });

      let detail = { agent_id, first_name, last_name, email, phone, properties: agentProperties }

      agents.push(detail)
    });

    return agents;
  }

  loadMore = () => {
    const page = this.state.page
    axios.get(`/api/properties?page=${page}`)
      .then( ({ data }) => {
        const agents = this.normalizeData(data.properties)
        this.setState({ agents: [...this.state.agents, ...agents], page: page + 1 })
      })
  }

   render() {
       //grabbing agents out of state (props)
    const { agents, page, total_pages } = this.state;
    return (
      <List styles={styles.scroller}>
        <Scroller
          pageStart={page}
          loadMore={this.loadMore}
          hasMore={ page < total_pages }
        >
          { agents.map( agent => {
              let { agent_id, first_name, last_name, email, properties } = agent;
              return (
                <List.Item key={agent_id}>
                  <List.Header>{first_name} {last_name} - {email}</List.Header>
                  <List.Item>
                    <Table celled>
                      <Table.Header>
                        <Table.Row>
                          <Table.HeaderCell>Price</Table.HeaderCell>
                          <Table.HeaderCell>Beds</Table.HeaderCell>
                          <Table.HeaderCell>Baths</Table.HeaderCell>
                          <Table.HeaderCell>Sq. Ft.</Table.HeaderCell>
                          <Table.HeaderCell>Street</Table.HeaderCell>
                          <Table.HeaderCell>City</Table.HeaderCell>
                          <Table.HeaderCell>ZIP</Table.HeaderCell>
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>
                        { properties.map( p =>
                            <Table.Row key={p.id}>
                              <Table.Cell>${p.price}</Table.Cell>
                              <Table.Cell>{p.beds}</Table.Cell>
                              <Table.Cell>{p.baths}</Table.Cell>
                              <Table.Cell>{p.sq_ft}</Table.Cell>
                              <Table.Cell>{p.street}</Table.Cell>
                              <Table.Cell>{p.city}</Table.Cell>
                              <Table.Cell>{p.zip}</Table.Cell>
                            </Table.Row>
                          )
                        }
                      </Table.Body>
                    </Table>
                  </List.Item>
                </List.Item>
              )
            })
          }
        </Scroller>
      </List>
    )
  }
}

export default Available
