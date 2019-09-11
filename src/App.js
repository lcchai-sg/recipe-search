import React, { Fragment, Component } from 'react';
import './App.css';

import { recipes } from './tempList';
import { key } from './config';

import RecipeList from './components/RecipeList';
import RecipeDetails from './components/RecipeDetails';

class App extends Component {
  state = {
    recipes: recipes,
    url: `https://www.food2fork.com/api/search?key=${key}`,
    base_url: `https://www.food2fork.com/api/search?key=${key}`,
    details_id: "54427",
    pageIndex: 1,
    search: '',
    query: '&q=',
  };

  async getRecipes() {
    try {
      const data = await fetch(this.state.url);
      const jsonData = await data.json();

      if (jsonData.recipes.length === 0) {
        this.setState(() => {
          return { error: 'sorry, your search did not return any result' }
        })
      } else {
        this.setState(() => {
          return { recipes: jsonData.recipes }
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  componentDidMount() {
    this.getRecipes();
  }

  displayPage = (index) => {
    switch (index) {
      default:
      case 1:
        return (
          <RecipeList
            recipes={this.state.recipes}
            handleDetails={this.handleDetails}
            value={this.state.search}
            handleChange={this.handleChange}
            handleSubmit={this.handleSubmit}
            error={this.state.error}
          />
        );
      case 0:
        return (
          <RecipeDetails
            id={this.state.details_id}
            handleIndex={this.handleIndex}
          />
        );
    }
  }

  handleIndex = index => {
    this.setState({
      pageIndex: index
    });
  }

  handleDetails = (index, id) => {
    this.setState({
      pageIndex: index,
      details_id: id,
    });
  }

  handleChange = (e) => {
    this.setState({
      search: e.target.value,
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { base_url, query, search } = this.state;
    this.setState(() => {
      return { url: `${base_url}${query}${search}`, search: '' }
    }, () => { this.getRecipes() })
  }

  render() {
    return (
      <Fragment>
        {this.displayPage(this.state.pageIndex)}
      </Fragment>
    );
  }
}

export default App;
