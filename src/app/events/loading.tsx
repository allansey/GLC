export default function Loading() {
    return (
        <div className="flex flex-col">
            <section className="bg-primary py-20 text-center text-primary-foreground">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="animate-pulse">
                        <div className="h-10 w-64 bg-primary-foreground/20 mx-auto mb-4 rounded"></div>
                        <div className="h-6 w-96 bg-primary-foreground/20 mx-auto rounded"></div>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-background">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="max-w-5xl mx-auto space-y-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-primary/10 h-64 animate-pulse">
                                <div className="grid md:grid-cols-[300px_1fr] gap-0 h-full">
                                    <div className="bg-gray-200 h-64 md:h-auto"></div>
                                    <div className="p-6 md:p-8 space-y-4">
                                        <div className="h-8 w-3/4 bg-gray-200 rounded"></div>
                                        <div className="flex gap-4">
                                            <div className="h-4 w-24 bg-gray-200 rounded"></div>
                                            <div className="h-4 w-24 bg-gray-200 rounded"></div>
                                        </div>
                                        <div className="h-20 w-full bg-gray-200 rounded"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
