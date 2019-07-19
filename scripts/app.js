/// <reference types="mithril" />

const Header = {
    view: () => m("header.app-header", [
        m(".layout-container", [
            m(".app-header-content", [
                m(".header-image", m("img[src='images/mithril-logo.svg']")),
                m("form.search-form[action=''][id='search-form'][method = 'GET']", {
                    onsubmit: function(e) {
                        e.preventDefault()
                        const query = e.target.getElementsByTagName('input')[0].value
                        if (query !== '' && query !== SearchResults.current_query) {
                            SearchResults.current_query = query
                            SearchResults.fetch(query)
                        }
                    }
                }, [
                    m("input.search-input[name='q'][placeholder='What are you looking for?'][type='text']"),
                    m("button.search-btn[type='submit']", "search")
                ])
            ])
        ])
    ])
}

const SearchResults = {
    raw_data: undefined,
    current_query: '',
    fetch: q => {
        const last_query = q
        return m.request({
            method: "GET",
            url: "https://codingthat-quick-json-back-end-2.glitch.me/posts",
            params: { q }
        })
        .then(data => {
            if (SearchResults.current_query === last_query) {
                SearchResults.current_query = ''
                SearchResults.raw_data = data
            }
        })
    },
    view: () => m("article.app-main", m(".post-list",
        typeof(SearchResults.raw_data) === 'undefined' // initial state only
        ? undefined
        : SearchResults.current_query
            ? m('p', 'Searching...') 
            : SearchResults.raw_data.length === 0
                ? m('p', 'Sorry, no results found.')
                : SearchResults.raw_data.map((result) => 
                    m(`a.post-list-item[href='${result.url}'][target='_blank']`, result.title)
                )
    ))
}

const Footer = {
    view: () => m("footer.app-footer", ["made with ",
        m("a[href='https://mithril.js.org/'][target='_blank']", "Mithril"), ". Check out the source on ",
        m("a[href='https://github.com/codingthat/mithril-toptal-demo'][target='_blank']", "GitHub"), "!"
    ])
}

const App = {
    view: () => m("main", [
        m(".layout[id='app']", [
            m(Header),
            m(".layout-container", [
                m(SearchResults),
                m(Footer)
            ])
        ])
    ])
}

m.mount(document.body, App)