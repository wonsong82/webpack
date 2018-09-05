const
    Path        = require('path'),
    Version     = require('webpack-version-file'),
    Webpack     = require('webpack'),
    UglifyJs    = require('uglifyjs-webpack-plugin'),
    MinifyCSS   = require('optimize-css-assets-webpack-plugin'),
    ExtractCSS  = require('mini-css-extract-plugin'),
    paths       = require('./webpack.path')


const env = (()=>{
    let development = false,
        production = false,
        debug = false

    for(let i=0; i<process.argv.length; i++){

        if(process.argv[i].indexOf('dev-server') !== -1)
            development = true

        if(process.argv[i].indexOf('production') !== -1)
            production = true
    }

    return development? 'development' : ( production? 'production' : 'debug' )
})();





// Loaders
const
    // copy files into assets folder
    fileLoader = {
        loader: 'file-loader',
        options: {
            name: file => {
                let match, prefix;
                prefix =
                    (match = file.match(/node_modules[\\\/](.+?)[\\\/]/i))
                    ?'vendors/' + match[1] + '/'
                    : ''
                return prefix + 'assets/[name].[ext]'
            }
        }
    },

    fileLoaderDev = {
        ...fileLoader,
        options: {
            ...fileLoader.options,
            publicPath: 'http://localhost:8080/dist/'
        }
    },

    // extract css into separate files
    extractCSSLoader =
        ExtractCSS.loader,

    // creates style nodes (inline) from JS strings
    styleLoader = {
        loader: 'style-loader',
        options: {
            sourceMap: true
        }
    },

    // translates CSS into CommonJS
    cssLoader = {
        loader: 'css-loader',
        options: {
            url: true,
            sourceMap: true
        }
    },

    // run various CSS modules
    postCSSLoader = {
        loader: 'postcss-loader',
        options: {
            ident: 'postcss',
            plugins: [
                require('postcss-cssnext')() // enable to use next gen css, auto vendor prefix
            ],
            sourceMap: true
        }
    },

    // compiles LESS to CSS
    lessLoader = {
        loader: 'less-loader',
        options: {
            sourceMap: true
        }
    },

    // compiles SASS/SCSS to CSS
    sassLoader = {
        loader: 'sass-loader',
        options: {
            sourceMap: true,
        }
    },

    // compiles STYL to CSS
    stylusLoader = {
        loader: 'stylus-loader',
        options: {
            sourceMap: true
        }
    },

    // transpile ES6 into es5, including react jsx
    // env          : latest env
    // stage-0      : to use properties in class
    // react        : to use react jsx
    babelLoader = {
        loader: 'babel-loader',
        options: {
            presets: ['env', 'react', 'stage-0' ],
            plugins: [
                'transform-object-rest-spread'
            ],
            babelrc: false
        }
    },
    babelLoaderDev = {
        ...babelLoader,
        options: {
            ...babelLoader.options,
            presets: [
                ...babelLoader.options.presets,
            ],
            plugins: [
                ...babelLoader.options.plugins,
                'react-hot-loader/babel' // necessary not to completely reload react modules
            ]
        }
    }




const FileType = {
    ASSET   : /\.(jpe?g|png|gif|svg|eot|ttf|woff|woff2)$/i,
    CSS     : /\.css$/i,
    SASS    : /(\.scss|\.sass)$/i,
    LESS    : /\.less$/i,
    STYLUS  : /\.styl$/i,
    JS      : /\.jsx?$/i,
}







// Configurations ///////////////
const Config = {};

Config.PRODUCTION = {
    entry: {
        ...paths.entries
    },
    output: {
        path: Path.join(__dirname, paths.contentBase, paths.outPath),
        filename: '[name].js'
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    optimization: {
        nodeEnv: 'production', // set node env
        minimizer: [
            new UglifyJs({
                sourceMap: false,
                uglifyOptions: {
                    output: {
                        comments: false
                    },
                    compress: {
                        warnings: false
                    }
                }
            }),
            new MinifyCSS({})
        ]

    },
    plugins: [
        new ExtractCSS({
            filename: '[name].css'
        }),
        new Version({
            output: Path.join(paths.contentBase, paths.outPath, 'version.txt'),
            data: {
                buildString: Math.floor(Date.now() / 1000)
            },
            templateString: '<%= name %>@<%= version %>\nBuild: <%= buildString %>\nBuild date: <%= buildDate %>'
        }),
    ],
    module: {
        rules: [
            {
                test: FileType.ASSET,
                use: [ fileLoader ]
            },
            {
                test: FileType.CSS,
                use: [ extractCSSLoader, cssLoader, postCSSLoader ]
            },
            {
                test: FileType.SASS,
                use: [ extractCSSLoader, cssLoader, postCSSLoader, sassLoader ]
            },
            {
                test: FileType.LESS,
                use: [ extractCSSLoader, cssLoader, postCSSLoader, lessLoader ]
            },
            {
                test: FileType.STYLUS,
                use: [ extractCSSLoader, cssLoader, postCSSLoader, stylusLoader ]
            },
            {
                test: FileType.JS,
                use: [ babelLoader ],
                exclude: /(node_modules|bower_components)/
            },
        ]
    },
    bail: true
}



Config.DEBUG = {
    entry: {
        ...paths.entries
    },
    output: {
        path: Path.join(__dirname, paths.contentBase, paths.outPath),
        filename: '[name].js'
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    optimization: {
        nodeEnv: 'production'
    },
    devtool: 'inline-source-map',
    plugins: [
        new ExtractCSS({
            filename: '[name].css'
        }),
        new Version({
            output: Path.join(paths.contentBase, paths.outPath, 'version.txt'),
            data: {
                buildString: Math.floor(Date.now() / 1000)
            },
            templateString: '<%= name %>@<%= version %>\nBuild: <%= buildString %>\nBuild date: <%= buildDate %>'
        }),
    ],
    module: {
        rules: [
            {
                test: FileType.ASSET,
                use: [ fileLoader ]
            },
            {
                test: FileType.CSS,
                use: [ extractCSSLoader, cssLoader, postCSSLoader ]
            },
            {
                test: FileType.SASS,
                use: [ extractCSSLoader, cssLoader, postCSSLoader, sassLoader ]
            },
            {
                test: FileType.LESS,
                use: [ extractCSSLoader, cssLoader, postCSSLoader, lessLoader ]
            },
            {
                test: FileType.STYLUS,
                use: [ extractCSSLoader, cssLoader, postCSSLoader, stylusLoader ]
            },
            {
                test: FileType.JS,
                use: [ babelLoader ],
                exclude: /(node_modules|bower_components)/
            },
        ]
    }
}






Config.DEVELOPMENT = {
    entry: {
        /*_hot: [ // seems unnecessary
            'react-hot-loader/patch', // activate HMR for React
            'webpack-dev-server/client?http://localhost:8080',// bundle the client for webpack-dev-server and connect to the provided endpoint
            'webpack/hot/only-dev-server', // bundle the client for hot reloading, only- means to only hot reload for successful updates
        ],*/
        ...paths.entries

    },
    output: {
        path: Path.join(__dirname, paths.contentBase, paths.outPath),
        publicPath: `http://localhost:${paths.devServer.port}/` + (paths.outPath? paths.outPath+'/' : ''),
        filename: '[name].js'
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    optimization: {
        nodeEnv: 'development'
    },
    devtool: 'inline-source-map',
    devServer: {
        headers: { "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"},
        publicPath: `http://localhost:${paths.devServer.port}/` + (paths.outPath? paths.outPath+'/' : ''),
        contentBase: Path.join(__dirname, paths.contentBase),
        hot: true, // // add if(module.hot) module.hot.accept() at the end of the entry.js
        hotOnly: false, // true: only refresh modules (not fully page reload)
        port: paths.devServer.port
    },
    plugins: [
        new Webpack.HotModuleReplacementPlugin(), // enable HMR globally
        new Webpack.NamedModulesPlugin(), // prints more readable module names in the browser console on HMR updates
    ],
    module: {
        rules: [
            {
                test: FileType.ASSET,
                use: [ fileLoaderDev ]
            },
            {
                test: FileType.CSS,
                use: [ styleLoader, cssLoader, postCSSLoader ]
            },
            {
                test: FileType.SASS,
                use: [ styleLoader, cssLoader, postCSSLoader, sassLoader ]
            },
            {
                test: FileType.LESS,
                use: [ styleLoader, cssLoader, postCSSLoader, lessLoader ]
            },
            {
                test: FileType.STYLUS,
                use: [ styleLoader, cssLoader, postCSSLoader, stylusLoader ]
            },
            {
                test: FileType.JS,
                use: [ babelLoaderDev ],
                exclude: /(node_modules|bower_components)/
            },
        ]
    }
}





module.exports = () => {
    switch(env){
        case 'production':
            return Config.PRODUCTION
        case 'debug':
            return Config.DEBUG
        case 'development':
            return Config.DEVELOPMENT
    }
}
























