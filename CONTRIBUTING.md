## Contributing

### Building

Open a terminal window.

Clone the generic-rbtree repo:
```
git clone git://github.com/geometryzen/generic-rbtree.git
```

Change to the repo directory:
```
cd generic-rbtree
```

Install Dependencis:
```
yarn install
```
to install the tooling dependencies (For this you need to have [Node.js](http://nodejs.org) installed).

## Making Changes

Make your changes to the TypeScript files in the _src_ directory.

## Testing

```
yarn watch
```

## Versioning

The following files should be changed.

```
package.json
```

## Git

```
yarn build
yarn pages
git add --all
git commit -m '...'
yarn changelog
git push origin master --tags
npm publish
```