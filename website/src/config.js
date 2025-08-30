const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://eylcglryevhfjsltgtvg.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5bGNnbHJ5ZXZoZmpzbHRndHZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0Njg1NjYsImV4cCI6MjA2OTA0NDU2Nn0.Hg6gDZDy_lxHhWZH-XqWYlRDeb_Dg-cij-c1tgpSnNs'

const supabase = createClient(supabaseUrl, supabaseKey)

module.exports = supabase 
