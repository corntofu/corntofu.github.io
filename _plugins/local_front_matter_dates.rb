# frozen_string_literal: true

# Interpret front matter dates that have no UTC offset in the site's `timezone`.
#
# YAML parses `date: 2026-11-23 17:11:00` as 17:11 UTC no matter what
# `timezone` says in _config.yml, so on a UTC CI runner a post written in KST
# looks 9 hours in the future and is skipped ("has a future date").
# With this plugin that value means 17:11 in `timezone` (Asia/Seoul), and you
# no longer need to write `+0900`. Dates that do carry an offset or `Z` are
# left untouched.
module LocalFrontMatterDates
  NAIVE_DATETIME = /
    ^date:\s*["']?
    (\d{4}-\d{1,2}-\d{1,2}[Tt\s]+\d{1,2}:\d{2}(?::\d{2}(?:\.\d+)?)?)
    ["']?\s*(?:\#.*)?$
  /x.freeze

  private

  def read_content(**opts)
    super
    return unless data["date"].is_a?(Time)

    raw = File.read(path, **Jekyll::Utils.merged_file_read_opts(site, opts))
    front_matter = raw[Jekyll::Document::YAML_FRONT_MATTER_REGEXP, 1]
    match = front_matter && front_matter.match(NAIVE_DATETIME)
    return unless match

    # Jekyll has already set ENV["TZ"] from the `timezone` setting, so
    # Time.parse reads an offset-less string as local time in that zone.
    data["date"] = Time.parse(match[1])
  end
end

Jekyll::Document.prepend(LocalFrontMatterDates)
