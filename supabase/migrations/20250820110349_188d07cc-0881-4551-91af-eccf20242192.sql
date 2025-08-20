-- Create table for affiliate applications
CREATE TABLE public.affiliate_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  website TEXT,
  experience TEXT,
  audience TEXT,
  referral_methods TEXT,
  expected_referrals TEXT,
  additional_info TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.affiliate_applications ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit applications
CREATE POLICY "Anyone can submit affiliate applications" 
ON public.affiliate_applications 
FOR INSERT 
WITH CHECK (true);

-- Only admins can view applications
CREATE POLICY "Admins can view all affiliate applications" 
ON public.affiliate_applications 
FOR SELECT 
USING (is_admin());

-- Only admins can update applications
CREATE POLICY "Admins can update affiliate applications" 
ON public.affiliate_applications 
FOR UPDATE 
USING (is_admin());

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_affiliate_applications_updated_at
BEFORE UPDATE ON public.affiliate_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();