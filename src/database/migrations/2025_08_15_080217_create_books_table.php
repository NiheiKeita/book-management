<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('books', function (Blueprint $table) {
            $table->id();
            $table->string('isbn')->nullable()->index();
            $table->string('title');
            $table->string('subtitle')->nullable();
            $table->string('author');
            $table->string('publisher')->nullable();
            $table->date('published_date')->nullable();
            $table->integer('page_count')->nullable();
            $table->string('cover_image_url')->nullable();
            $table->text('description')->nullable();
            $table->string('category')->nullable();
            $table->enum('source', ['oreilly', 'google', 'manual']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('books');
    }
};
