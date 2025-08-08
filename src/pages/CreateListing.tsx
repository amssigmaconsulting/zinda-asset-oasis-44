import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Upload, X, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const listingSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  property_type: z.string().min(1, "Please select a property type"),
  price: z.string().min(1, "Price is required"),
  location: z.string().min(3, "Location must be at least 3 characters"),
  bedrooms: z.string().optional(),
  bathrooms: z.string().optional(),
  square_feet: z.string().optional(),
  // Automobile specific fields
  year: z.string().optional(),
  mileage: z.string().optional(),
  fuel_type: z.string().optional(),
  condition: z.string().optional(),
  make: z.string().optional(),
  model: z.string().optional(),
  images: z.array(z.string()).min(1, "At least one image is required"),
});

type ListingFormData = z.infer<typeof listingSchema>;

const CreateListing = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [listingType, setListingType] = useState<"real-estate" | "automobile">("real-estate");
  const [listingPurpose, setListingPurpose] = useState<"sale" | "rent" | "auction">("sale");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      title: "",
      description: "",
      property_type: "",
      price: "",
      location: "",
      bedrooms: "",
      bathrooms: "",
      square_feet: "",
      year: "",
      mileage: "",
      fuel_type: "",
      condition: "",
      make: "",
      model: "",
      images: [],
    },
  });

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      const newImageUrls: string[] = [];

      // Create preview URLs for immediate display
      newFiles.forEach((file) => {
        const previewUrl = URL.createObjectURL(file);
        newImageUrls.push(previewUrl);
      });

      setImageFiles([...imageFiles, ...newFiles]);
      setUploadedImages([...uploadedImages, ...newImageUrls]);
      form.setValue("images", [...uploadedImages, ...newImageUrls]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    const newFiles = imageFiles.filter((_, i) => i !== index);
    
    // Revoke the object URL to prevent memory leaks
    URL.revokeObjectURL(uploadedImages[index]);
    
    setUploadedImages(newImages);
    setImageFiles(newFiles);
    form.setValue("images", newImages);
  };

  const uploadImageToSupabase = async (file: File, fileName: string): Promise<string | null> => {
    try {
      const { data, error } = await supabase.storage
        .from('property-images')
        .upload(fileName, file);

      if (error) {
        console.error('Error uploading image:', error);
        return null;
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('property-images')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const onSubmit = async (data: ListingFormData) => {
    setIsSubmitting(true);
    
    try {
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to create a listing.",
          variant: "destructive",
        });
        navigate("/sell");
        return;
      }

      // Upload images to Supabase Storage
      const imageUrls: string[] = [];
      
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        const fileName = `${user.id}/${Date.now()}-${i}-${file.name}`;
        const imageUrl = await uploadImageToSupabase(file, fileName);
        
        if (imageUrl) {
          imageUrls.push(imageUrl);
        }
      }

      if (imageUrls.length === 0) {
        toast({
          title: "Image Upload Failed",
          description: "Please try uploading your images again.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Create the listing in the database
      const { error } = await supabase
        .from('property_listings')
        .insert({
          user_id: user.id,
          title: data.title,
          description: data.description,
          property_type: data.property_type,
          price: parseFloat(data.price.replace(/[^0-9.]/g, '')),
          location: data.location,
          bedrooms: data.bedrooms ? parseInt(data.bedrooms) : null,
          bathrooms: data.bathrooms ? parseInt(data.bathrooms) : null,
          square_feet: data.square_feet ? parseInt(data.square_feet) : null,
          // Automobile specific fields
          year: data.year ? parseInt(data.year) : null,
          mileage: data.mileage || null,
          fuel_type: data.fuel_type || null,
          condition: data.condition || null,
          make: data.make || null,
          model: data.model || null,
          images: imageUrls,
          listing_purpose: listingPurpose,
          status: 'active'
        });

      if (error) {
        console.error('Error creating listing:', error);
        toast({
          title: "Error Creating Listing",
          description: "There was an error creating your listing. Please try again.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      toast({
        title: "Listing Created Successfully!",
        description: "Your listing has been created and is now live.",
      });

      // Clean up object URLs
      uploadedImages.forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });

      // Navigate back to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error('Error creating listing:', error);
      toast({
        title: "Error Creating Listing",
        description: "There was an unexpected error. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const realEstateCategories = [
    { value: "house", label: "House" },
    { value: "apartment", label: "Apartment" },
    { value: "condo", label: "Condo" },
    { value: "townhouse", label: "Townhouse" },
    { value: "land", label: "Land" },
    { value: "commercial", label: "Commercial" },
  ];

  const automobileCategories = [
    { value: "sedan", label: "Sedan" },
    { value: "suv", label: "SUV" },
    { value: "truck", label: "Truck" },
    { value: "coupe", label: "Coupe" },
    { value: "convertible", label: "Convertible" },
    { value: "hatchback", label: "Hatchback" },
    { value: "wagon", label: "Wagon" },
    { value: "motorcycle", label: "Motorcycle" },
  ];

  const fuelTypes = [
    { value: "petrol", label: "Petrol" },
    { value: "diesel", label: "Diesel" },
    { value: "electric", label: "Electric" },
    { value: "hybrid", label: "Hybrid" },
  ];

  const conditions = [
    { value: "new", label: "New" },
    { value: "like-new", label: "Like New" },
    { value: "good", label: "Good" },
    { value: "fair", label: "Fair" },
    { value: "poor", label: "Poor" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <Button variant="ghost" size="sm" asChild className="self-start">
              <Link to="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Back to Dashboard</span>
                <span className="sm:hidden">Back</span>
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Create New Listing</h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-1">Add a new property to {listingPurpose === "rent" ? "rent" : listingPurpose === "auction" ? "auction" : "sell"}</p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Listing Type Selection */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>What are you listing?</CardTitle>
              <CardDescription>Choose the type of item you want to list</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <Button
                  type="button"
                  variant={listingType === "real-estate" ? "default" : "outline"}
                  className="h-16 flex flex-col space-y-2"
                  onClick={() => {
                    setListingType("real-estate");
                    form.setValue("property_type", "");
                  }}
                >
                  <span className="text-lg">🏠</span>
                  <span>Real Estate</span>
                </Button>
                <Button
                  type="button"
                  variant={listingType === "automobile" ? "default" : "outline"}
                  className="h-16 flex flex-col space-y-2"
                  onClick={() => {
                    setListingType("automobile");
                    form.setValue("property_type", "");
                  }}
                >
                  <span className="text-lg">🚗</span>
                  <span>Automobile</span>
                </Button>
              </div>

              {/* Listing Purpose Selection */}
              <div>
                <label className="text-sm font-medium mb-3 block">Listing Purpose</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Button
                    type="button"
                    variant={listingPurpose === "sale" ? "default" : "outline"}
                    className="h-12 flex items-center justify-center space-x-2"
                    onClick={() => setListingPurpose("sale")}
                  >
                    <span>💰</span>
                    <span>For Sale</span>
                  </Button>
                  <Button
                    type="button"
                    variant={listingPurpose === "rent" ? "default" : "outline"}
                    className="h-12 flex items-center justify-center space-x-2"
                    onClick={() => setListingPurpose("rent")}
                  >
                    <span>🔑</span>
                    <span>For Rent</span>
                  </Button>
                  <Button
                    type="button"
                    variant={listingPurpose === "auction" ? "default" : "outline"}
                    className="h-12 flex items-center justify-center space-x-2"
                    onClick={() => setListingPurpose("auction")}
                  >
                    <span>🔨</span>
                    <span>For Auction</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
              <Tabs defaultValue="basic" className="space-y-4 sm:space-y-6">
                <TabsList className="grid w-full grid-cols-3 h-auto p-1">
                  <TabsTrigger value="basic" className="text-xs sm:text-sm px-2 py-2 sm:py-2.5">
                    <span className="hidden sm:inline">Basic Information</span>
                    <span className="sm:hidden">Basic</span>
                  </TabsTrigger>
                  <TabsTrigger value="details" className="text-xs sm:text-sm px-2 py-2 sm:py-2.5">
                    <span className="hidden sm:inline">Details & Pricing</span>
                    <span className="sm:hidden">Details</span>
                  </TabsTrigger>
                  <TabsTrigger value="images" className="text-xs sm:text-sm px-2 py-2 sm:py-2.5">
                    <span className="hidden sm:inline">Images & Review</span>
                    <span className="sm:hidden">Images</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Basic Information</CardTitle>
                      <CardDescription>
                        Provide the essential details about your listing
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm sm:text-base">Title</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Enter a descriptive title for your listing" 
                                  className="h-11 sm:h-10 text-base sm:text-sm touch-manipulation" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormDescription className="text-xs sm:text-sm">
                                Make it clear and descriptive - this is what buyers will see first
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm sm:text-base">Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Describe your property in detail..."
                                className="min-h-[100px] sm:min-h-[120px] text-base sm:text-sm touch-manipulation resize-none"
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription className="text-xs sm:text-sm">
                              Include details about features, condition, amenities, and location highlights
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="property_type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{listingType === "automobile" ? "Vehicle Type" : "Property Type"}</FormLabel>
                            <Select onValueChange={(value) => {
                              field.onChange(value);
                              setSelectedCategory(value);
                            }}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={`Select a ${listingType === "automobile" ? "vehicle" : "property"} type`} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {(listingType === "automobile" ? automobileCategories : realEstateCategories).map((category) => (
                                  <SelectItem key={category.value} value={category.value}>
                                    {category.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Choose the type that best describes your {listingType === "automobile" ? "vehicle" : "property"}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="details" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Details & Pricing</CardTitle>
                      <CardDescription>
                        Set your price and provide additional details
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <FormField
                          control={form.control}
                          name="price"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm sm:text-base">
                                {listingPurpose === "auction" ? "Starting Price" : "Price"} (₦)
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder={
                                    listingPurpose === "auction" 
                                      ? "Enter starting price (e.g., ₦50,000,000)" 
                                      : listingPurpose === "rent"
                                      ? "Enter rental price (e.g., ₦2,500,000/month)"
                                      : "Enter price (e.g., ₦500,000,000)"
                                  }
                                  className="h-11 sm:h-10 text-base sm:text-sm touch-manipulation"
                                  {...field} 
                                />
                              </FormControl>
                              <FormDescription className="text-xs sm:text-sm">
                                {listingPurpose === "auction" 
                                  ? "Set the starting bid amount in Nigerian Naira (₦)" 
                                  : listingPurpose === "rent"
                                  ? "Set the monthly rental price in Nigerian Naira (₦)"
                                  : "Set a competitive price in Nigerian Naira (₦)"}
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm sm:text-base">Location</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="City, State" 
                                  className="h-11 sm:h-10 text-base sm:text-sm touch-manipulation"
                                  {...field} 
                                />
                              </FormControl>
                              <FormDescription className="text-xs sm:text-sm">
                                Where is the property located?
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Conditional fields based on listing type */}
                      {listingType === "real-estate" ? (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                          <FormField
                            control={form.control}
                            name="bedrooms"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm sm:text-base">Bedrooms</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="e.g., 3" 
                                    className="h-11 sm:h-10 text-base sm:text-sm touch-manipulation"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormDescription className="text-xs sm:text-sm">
                                  Number of bedrooms
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="bathrooms"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm sm:text-base">Bathrooms</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="e.g., 2" 
                                    className="h-11 sm:h-10 text-base sm:text-sm touch-manipulation"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormDescription className="text-xs sm:text-sm">
                                  Number of bathrooms
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="square_feet"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm sm:text-base">Square Feet</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="e.g., 1500" 
                                    className="h-11 sm:h-10 text-base sm:text-sm touch-manipulation"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormDescription className="text-xs sm:text-sm">
                                  Total square footage
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                          <FormField
                            control={form.control}
                            name="make"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm sm:text-base">Make</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="e.g., Toyota" 
                                    className="h-11 sm:h-10 text-base sm:text-sm touch-manipulation"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormDescription className="text-xs sm:text-sm">
                                  Vehicle manufacturer
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="model"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm sm:text-base">Model</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="e.g., Camry" 
                                    className="h-11 sm:h-10 text-base sm:text-sm touch-manipulation"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormDescription className="text-xs sm:text-sm">
                                  Vehicle model
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="year"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm sm:text-base">Year</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="e.g., 2020" 
                                    className="h-11 sm:h-10 text-base sm:text-sm touch-manipulation"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormDescription className="text-xs sm:text-sm">
                                  Year of manufacture
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="mileage"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm sm:text-base">Mileage</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="e.g., 45,000 km" 
                                    className="h-11 sm:h-10 text-base sm:text-sm touch-manipulation"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormDescription className="text-xs sm:text-sm">
                                  Total distance traveled
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="fuel_type"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Fuel Type</FormLabel>
                                <Select onValueChange={field.onChange}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select fuel type" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {fuelTypes.map((type) => (
                                      <SelectItem key={type.value} value={type.value}>
                                        {type.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormDescription>
                                  Type of fuel the vehicle uses
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="condition"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Condition</FormLabel>
                                <Select onValueChange={field.onChange}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select condition" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {conditions.map((cond) => (
                                      <SelectItem key={cond.value} value={cond.value}>
                                        {cond.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormDescription>
                                  Current condition of the vehicle
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="images" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Images</CardTitle>
                      <CardDescription>
                        Upload high-quality images of your item
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="border-2 border-dashed border-border rounded-lg p-4 sm:p-8 text-center touch-manipulation">
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                        />
                        <label htmlFor="image-upload" className="cursor-pointer block">
                          <Upload className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-2 sm:mb-4" />
                          <p className="text-sm sm:text-base text-muted-foreground mb-1 sm:mb-2">
                            <span className="hidden sm:inline">Drag and drop images here, or </span>
                            <span className="font-medium text-primary">tap to browse</span>
                          </p>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            PNG, JPG up to 10MB each
                          </p>
                        </label>
                      </div>

                      {uploadedImages.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                          {uploadedImages.map((image, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={image}
                                alt={`Upload ${index + 1}`}
                                className="w-full h-20 sm:h-24 object-cover rounded-lg"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute -top-1 -right-1 h-7 w-7 sm:h-6 sm:w-6 rounded-full p-0 touch-manipulation opacity-90 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeImage(index)}
                              >
                                <X className="h-3 w-3 sm:h-3 sm:w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex justify-between items-center">
                        <Badge variant="outline">
                          {uploadedImages.length} image(s) uploaded
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Review & Submit</CardTitle>
                      <CardDescription>
                        Review your listing before publishing
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <Button 
                          type="submit" 
                          className="flex-1 h-11 sm:h-10 text-base sm:text-sm touch-manipulation" 
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Creating Listing...
                            </>
                          ) : (
                            "Create Listing"
                          )}
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          asChild 
                          disabled={isSubmitting}
                          className="h-11 sm:h-10 px-6 touch-manipulation"
                        >
                          <Link to="/dashboard">Cancel</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default CreateListing;