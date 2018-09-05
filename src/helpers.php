<?php
use Won\Webpack\Webpack;

if(!function_exists('dist')){
    function dist( $filename ){
        return Webpack::url( $filename );
    }
}