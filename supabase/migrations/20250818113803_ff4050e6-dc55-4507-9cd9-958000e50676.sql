-- Enable leaked password protection
UPDATE auth.config 
SET 
  password_min_length = 8,
  password_require_letters = true,
  password_require_digits = true,
  password_require_symbols = false,
  password_require_uppercase = false,
  hibp_enabled = true
WHERE id = 'default';