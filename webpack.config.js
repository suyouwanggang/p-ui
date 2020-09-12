const path=require('path');
const HtmlWebpackPlugin=require('html-webpack-plugin');
const {CleanWebpackPlugin}=require('clean-webpack-plugin');
module.exports={
 mode:'development',
 entry:{
    index:'./index.ts',
 },
output:{
        path:path.resolve(__dirname,'build'),
        filename:'[name].bundle.js'
    },
    module:{
        rules:[
            {
                test:/\.css$/,
                use:[
                    'style-loader',
                    'css-loader'
                ]
             },
             {
                test:/\.(png|svg|jpg|gif)$/,
                use:[
                    'file-loader'
                    
                ]
             },
             {
                test:/\.(woff|woff2|eot|ttf|otf)$/,
                use:[
                    'file-loader'
                    
                ]
             },
             {
                test:/\.(ts)$/,
                use:[
                    {
                        loader:'ts-loader',
                        options:{
                            transpileOnly:true
                        }
                    }
                ]
             },
             
        ]
    },
    resolve:{
        extensions:['.js','.ts','.json']
    },
    plugins:[
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title:'p-ui',
            template:'./index.html'

        })

    ]
    

}