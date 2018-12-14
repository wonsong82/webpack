<?php
namespace Won\Webpack;


class Webpack {


    public static function url( $filename )
    {
        if(preg_match('/\.css$/', $filename)){
            $url = self::getDistUrl() . $filename;
            if(env('NODE_ENV') == 'production'){
                $url .= '?v=' . self::getBuildVersion();
				return "<link rel=\"stylesheet\" type=\"text/css\" href=\"{$url}\">";                
			}
			else
				return ''; // css loaded within js
		}
		
        elseif(preg_match('/\.js$/', $filename)){
            $url = self::getDistUrl() . $filename;
            if(env('NODE_ENV') == 'production'){
                $url .= '?v=' . self::getBuildVersion();
            }

            return "<script src=\"{$url}\"></script>";
        }
		
        else {
            return '';
        }

    }



    public static function getBuildVersion()
    {
        if(file_exists(public_path('dist/version.txt'))) {
            $version = file_get_contents(public_path('dist/version.txt'));
            $version = substr(explode("\n", $version)[1], 7);
            return $version;
        }

        return '1';
    }



    public static function getDistUrl()
    {
        return env('NODE_ENV') == 'development' && !strstr(url('/'), '.xip.io') ?
            'http://localhost:8080/dist/' : url('dist') . '/';
    }
    
    
}

