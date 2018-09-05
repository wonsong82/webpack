<?php
namespace Won\Webpack;

use Illuminate\Support\ServiceProvider;


class WebpackServiceProvider extends ServiceProvider
{

    public function boot()
    {
        $this->publishes([__DIR__.'/files' => base_path()]);

    }



}