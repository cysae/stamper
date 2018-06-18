import React, { Component } from 'react'
import styled from 'styled-components'
import { Document } from '@react-pdf/dom'
import { Page, Text, Image, View, StyleSheet } from '@react-pdf/core';
console.log(__dirname)

const Wrapper = styled.div`
  display: flex;

  iframe {
    flex: 1;
    height: 80vh;
  }
`

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  },
  image: {
    width: '100px',
    height: '100px',
    backgroundColor: 'grey',
    padding: 10
  },

});

export default class Certificate extends Component {
  render() {
    const { title } = this.props
    return (
      <Wrapper>
        <Document>
          <Page size="A4" style={styles.page}>
            <View style={styles.section}>
              <Image
                style={styles.image}
                src="http://localhost:3000/static/media/logo.f94dd768.png"
              />
            </View>
            <View style={styles.section}>
              <Text>Header</Text>
            </View>
            <View style={styles.section}>
              <Text>BlockchainLogo</Text>
            </View>
          </Page>
        </Document>
      </Wrapper>
    )
  }
}
