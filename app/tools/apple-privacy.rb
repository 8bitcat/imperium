# App Privacy för Imperium i App Store Connect: de uppgifter som Google AdMob samlar in (det finns inget officiellt API
# för App Privacy, så det går via Carls Apple ID-session – samma väg som fastlane upload_app_privacy_details_to_app_store
# och mobilfabriken/app/tools/apple-webb.rb). Skickar ALDRIG ett lösenord: är sessionen ute skriver skriptet
# SESSION_UTGANGEN och slutar – Carl kör då D:\GamesProjects\mobilfabriken\app\tools\apple-inloggning.ps1.
#   ruby app/tools/apple-privacy.rb [visa]     visar det som står i App Store Connect nu
#   ruby app/tools/apple-privacy.rb satt       ersätter med deklarationen nedan och publicerar
# Deklarationen följer Googles vägledning för Google Mobile Ads SDK (developers.google.com/admob/ios/privacy/data-disclosure):
# annons-ID, ungefärlig plats, produktinteraktion och annonsdata till tredjepartsreklam och analys (spårning när
# användaren tillåter det i ATT), kraschdata, prestandadata och övrig diagnostik till analys. Inget kopplas till
# användarens identitet – spelet har inga konton. Spelet självt samlar inget (sparning lokalt, rummen är peer-to-peer).
require 'spaceship'

BUNDLE = 'io.eightbitcat.imperium'
REKLAM = %w[THIRD_PARTY_ADVERTISING ANALYTICS]
DEKLARATION = [
  { 'category' => 'DEVICE_ID',             'purposes' => REKLAM,        'data_protections' => %w[DATA_NOT_LINKED_TO_YOU DATA_USED_TO_TRACK_YOU] },
  { 'category' => 'COARSE_LOCATION',       'purposes' => REKLAM,        'data_protections' => %w[DATA_NOT_LINKED_TO_YOU DATA_USED_TO_TRACK_YOU] },
  { 'category' => 'PRODUCT_INTERACTION',   'purposes' => REKLAM,        'data_protections' => %w[DATA_NOT_LINKED_TO_YOU DATA_USED_TO_TRACK_YOU] },
  { 'category' => 'ADVERTISING_DATA',      'purposes' => REKLAM,        'data_protections' => %w[DATA_NOT_LINKED_TO_YOU DATA_USED_TO_TRACK_YOU] },
  { 'category' => 'CRASH_DATA',            'purposes' => %w[ANALYTICS], 'data_protections' => %w[DATA_NOT_LINKED_TO_YOU] },
  { 'category' => 'PERFORMANCE_DATA',      'purposes' => %w[ANALYTICS], 'data_protections' => %w[DATA_NOT_LINKED_TO_YOU] },
  { 'category' => 'OTHER_DIAGNOSTIC_DATA', 'purposes' => %w[ANALYTICS], 'data_protections' => %w[DATA_NOT_LINKED_TO_YOU] },
].freeze

IDFIL = File.join(Dir.home, '.secrets', 'apple-id.txt')
abort('SESSION_UTGANGEN – ingen inloggning än: kör mobilfabriken/app/tools/apple-inloggning.ps1') unless File.exist?(IDFIL)
USER = File.read(IDFIL).strip
ENV['FASTLANE_PASSWORD'] = 'anvands-inte-sessionen-kontrolleras-forst'   # login() kräver ett värde; skickas bara om sessionen är giltig
PIXELCITY_BUNDLE = 'io.eightbitcat.pixelcity'   # för att välja rätt team (8bitcat)

def session_ok?
  c = Spaceship::TunesClient.new
  c.user = USER
  c.send(:load_session_from_file) && (c.send(:fetch_olympus_session) rescue false) ? true : false
rescue StandardError
  false
end

def logga_in
  abort('SESSION_UTGANGEN – kör mobilfabriken/app/tools/apple-inloggning.ps1 (lösenord + kod), sedan igen') unless session_ok?
  Spaceship::Tunes.login(USER, ENV['FASTLANE_PASSWORD'])
  Spaceship::Tunes.client.teams.each do |t|
    id = t['providerId'] || t.dig('contentProvider', 'contentProviderId')
    Spaceship::Tunes.client.team_id = id
    Spaceship::ConnectAPI.login(USER, ENV['FASTLANE_PASSWORD'], use_portal: false, use_tunes: true, tunes_team_id: id, skip_select_team: true)
    return id if Spaceship::ConnectAPI::App.find(PIXELCITY_BUNDLE)
  end
  abort('hittar inget team med Pixelcity')
end

def visa(app)
  usages = Spaceship::ConnectAPI::AppDataUsage.all(app_id: app.id, includes: 'category,grouping,purpose,dataProtection', limit: 500)
  puts "App Privacy (#{usages.size} rader):"
  usages.map { |u| [u.category&.id, u.purpose&.id, u.data_protection&.id].compact.join(' · ') }.sort.each { |r| puts "  #{r}" }
  state = Spaceship::ConnectAPI::AppDataUsagesPublishState.get(app_id: app.id)
  puts "publicerad: #{state.published ? 'ja' : 'nej'}"
end

logga_in
app = Spaceship::ConnectAPI::App.find(BUNDLE) or abort("ingen app #{BUNDLE}")
case ARGV[0] || 'visa'
when 'visa'
  visa(app)
when 'satt'
  Spaceship::ConnectAPI::AppDataUsage.all(app_id: app.id, includes: 'category,grouping,purpose,dataProtection', limit: 500).each(&:delete!)
  DEKLARATION.each do |d|
    d['data_protections'].each do |skydd|
      # spårning hör till datatypen, inte till syftet – Apple sparar den utan syfte, så en rad räcker
      syften = skydd == 'DATA_USED_TO_TRACK_YOU' ? [nil] : d['purposes']
      syften.each do |purpose|
        Spaceship::ConnectAPI::AppDataUsage.create(app_id: app.id, app_data_usage_category_id: d['category'],
                                                   app_data_usage_protection_id: skydd, app_data_usage_purpose_id: purpose)
      end
    end
  end
  state = Spaceship::ConnectAPI::AppDataUsagesPublishState.get(app_id: app.id)
  state.publish! unless state.published
  visa(app)
else
  abort("okänt kommando #{ARGV[0]}")
end
