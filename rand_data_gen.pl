#!/usr/bin/perl -w

use strict;
use Data::Random qw(:all);
use Data::Dumper;

open FH, "> data.csv" or die "$!\n";
print FH "time\tscore\tnote\n";
for(1..365)
{
	my $dt = rand_datetime();
	$dt =~ s/\-/\//g;
	print FH $dt, "\t";
	print FH int(rand(10)+1), "\t";
	print FH join ' ', rand_words(size=>int(rand(5)+1));
	print FH "\n";
}
close FH;