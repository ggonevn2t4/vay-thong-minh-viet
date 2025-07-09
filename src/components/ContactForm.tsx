import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Mail, Phone, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import CompanyBankInfo from '@/components/CompanyBankInfo';
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Tên phải có ít nhất 2 ký tự"
  }),
  email: z.string().email({
    message: "Email không hợp lệ"
  }),
  phone: z.string().min(10, {
    message: "Số điện thoại phải có ít nhất 10 chữ số"
  }),
  message: z.string().min(10, {
    message: "Tin nhắn phải có ít nhất 10 ký tự"
  })
});
type FormValues = z.infer<typeof formSchema>;
const ContactForm = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: ""
    }
  });
  const onSubmit = (data: FormValues) => {
    console.log(data);
    toast.success("Thông tin của bạn đã được gửi. Chúng tôi sẽ liên hệ sớm nhất có thể!");
    form.reset();
  };
  return <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <span className="text-brand-600 font-medium mb-2 block">Liên hệ</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Nhận tư vấn cá nhân hóa từ chuyên gia
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                Hãy để lại thông tin của bạn, chúng tôi sẽ liên hệ để tư vấn các gói vay phù hợp nhất với nhu cầu của bạn.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-brand-100 p-3 rounded-full mr-4">
                    <Phone className="h-6 w-6 text-brand-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Điện thoại</h3>
                    <p className="text-gray-600">0765080960</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-brand-100 p-3 rounded-full mr-4">
                    <Mail className="h-6 w-6 text-brand-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Email</h3>
                    <p className="text-gray-600">Finzytechnology@gmail.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-brand-100 p-3 rounded-full mr-4">
                    <MessageCircle className="h-6 w-6 text-brand-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Chatbot</h3>
                    <p className="text-gray-600">Hỗ trợ trực tuyến 24/7</p>
                  </div>
                </div>
              </div>

              {/* Company Bank Information */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <CompanyBankInfo compact />
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              <h3 className="text-2xl font-semibold mb-6 text-gray-800">Gửi yêu cầu tư vấn</h3>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <FormField control={form.control} name="name" render={({
                  field
                }) => <FormItem>
                        <FormLabel>Họ và tên</FormLabel>
                        <FormControl>
                          <Input placeholder="Nhập họ tên của bạn" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />
                  
                  <FormField control={form.control} name="email" render={({
                  field
                }) => <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="example@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />
                  
                  <FormField control={form.control} name="phone" render={({
                  field
                }) => <FormItem>
                        <FormLabel>Số điện thoại</FormLabel>
                        <FormControl>
                          <Input placeholder="Nhập số điện thoại của bạn" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />
                  
                  <FormField control={form.control} name="message" render={({
                  field
                }) => <FormItem>
                        <FormLabel>Tin nhắn</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Mô tả nhu cầu vay vốn của bạn và thời gian phù hợp để được liên hệ" className="min-h-[120px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />
                  
                  <Button type="submit" className="w-full bg-brand-600 hover:bg-brand-700 py-6">
                    Gửi yêu cầu tư vấn
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default ContactForm;