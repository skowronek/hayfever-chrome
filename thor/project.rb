# module: project
class Project < Thor
	include Thor::Actions

	@@excludes = [
		'.git',
		'.gitignore',
		'Thorfile',
		'.DS_Store',
		'sass',
		'.sass-cache',
		'test',
		'coffeescripts',
		'config.rb',
		'.rvmrc',
		'Gemfile',
		'Gemfile.lock'
	].map {|exc| "--exclude=#{exc}"}.join(' ')

  desc 'build', 'Compile all assets (CoffeeScript and Sass)'
  def build
    thor "css:compile"
    thor "coffeescript:compile"
  end

	desc 'bundle', 'Bundle the project into a zip file'
	def bundle
    require 'json'
    require 'zip'

    thor "project:build"

    pkg_dir  = $root_dir.join 'pkg'
    dist_dir = $root_dir.join 'dist'
    manifest = JSON.parse dist_dir.join('manifest.json').read
    version  = manifest['version']
    output   = pkg_dir.join "hayfever-v#{version}.zip"

    Dir.mkdir pkg_dir unless pkg_dir.directory?
    output.unlink if output.file?

    Zip::File.open output.to_s do |zip|
      Pathname.glob(dist_dir.join('**', '**')).each do |file|
        # [todo] - Finish bundle zip task
      end
    end
	end

	desc 'prep_release', 'Syncs all necessary files to ~/ProjectFiles/Hayfever/hayfever in preparation for packing in Chrome'
	def prep_release
		invoke 'css:compile'
		invoke 'coffeescript:compile'

		sync_dir = Pathname.new("~/ProjectFiles/Hayfever/hayfever")
		
		unless sync_dir.directory?
			say_status 'mkdir', 'Creating sync directory', :yellow
			`mkdir -p ~/ProjectFiles/Hayfever/hayfever`
		end

		say 'Copying files to ~/ProjectFiles/Hayfever/hayfever', :blue
		IO.popen("rsync -avr #{@@excludes} --delete ./ ~/ProjectFiles/Hayfever/hayfever/") do |rsync|
			while line = rsync.gets
				say line
			end
		end
		say 'Done.', :green
	end
end
